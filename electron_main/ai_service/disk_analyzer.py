# electron_main/ai_service/disk_analyzer.py (More detailed version)

import sys
import json
import psutil # For disk stats, OS agnostic info
import platform
import os
import time # For timing operations

# --- Library Loading ---
# Attempt to import ML libraries. Provide fallback if not available.
TRANSFORMERS_AVAILABLE = False
LLAMA_CPP_AVAILABLE = False
try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
    print("INFO: Transformers library loaded successfully.", file=sys.stderr)
except ImportError:
    print("WARNING: Transformers library not found. ML capabilities will be limited. Install with: pip install transformers torch sentencepiece", file=sys.stderr)

try:
    # Example for llama-cpp-python. This needs pre-built model files.
    # from llama_cpp import Llama
    # LLAMA_CPP_AVAILABLE = True # Assume True if it loads without error
    LLAMA_CPP_AVAILABLE = False # Assume False until proper model setup is confirmed
    print("WARNING: llama-cpp-python library assumed not fully configured for AI service.", file=sys.stderr)
except ImportError:
    print("WARNING: llama-cpp-python library not found. Local LLM functionality is disabled. Install with: pip install llama-cpp-python", file=sys.stderr)
    # LLAMA_CPP_AVAILABLE = False

# --- Model Configuration ---
# A more structured configuration for models. Paths should be relative to AI service or absolute.
# You'll need to download these models separately.
MODEL_CONFIG = {
    "recommendation_pipeline": {
        "task": "zero-shot-classification",
        # A smaller model might be better for faster loading/execution
        "model_name": "facebook/bart-large-mnli", # Good general purpose NLI model
        "labels": ["security_focused", "performance_balanced", "usability_simple"],
        "preprocessor_args": {} # If model requires specific tokenizer config
    },
    # "local_llm": { # Example if using Llama locally
    #     "path": os.environ.get("LLAMA_MODEL_PATH", "/app/models/llama-2-7b-chat.gguf"), # Path to your GGUF model file
    #     "n_ctx": 1024, # Context window size
    #     "n_gpu_layers": -1 # Use all available GPU layers if GPU is supported by llama-cpp-python
    # }
}

# --- Utility Functions ---
def get_disk_media_type_windows(disk_caption):
    """Placeholder: Tries to determine if a disk is SSD on Windows using WMIC."""
    # This requires `wmic` and careful parsing. A library like `os-drive` would be better.
    # For demonstration, we use a crude text check on description from previous wmic calls.
    return "SSD" in disk_caption # Very simplistic. Needs actual disk identification logic.

def estimate_performance_impact(algorithm: str, disk_is_ssd: bool, disk_size_gb: float) -> float:
    """Estimates performance overhead. Higher is worse performance."""
    impact = 0.0
    # Base impact per algorithm (higher for more complex/slower algorithms)
    algo_impact = {
        "AES-256": 0.1,
        "Serpent": 0.15,
        "Twofish": 0.12,
        "AES-Serpent-Twofish": 0.3, # Cascade is heaviest
    }
    impact += algo_impact.get(algorithm, 0.1)

    # SSDs are generally faster, less sensitive to encryption impact on raw read/write
    if disk_is_ssd:
        impact *= 0.8 # Reduce impact for SSDs

    # Larger volumes/more data to process = potentially higher impact, but also higher security need
    if disk_size_gb > 1000: # Terabyte scale
        impact *= 1.1 # Slight increase for very large volumes (as encryption matters more)

    return max(0.05, impact) # Ensure impact is at least some value


def suggest_password_strength(disk_size_gb: float, user_os: str, ai_score: float) -> int:
    """Suggests a password strength score (0-100) based on context."""
    base_strength = 70
    
    # Factor in disk size and security needs
    if disk_size_gb > 1000: # Large volume
        base_strength += 5
    
    # Factor in user OS and potentially its known security features (like Secure Boot on Windows)
    if user_os and "Windows" in user_os and any(c in user_os for c in ['10', '11']): # Modern Windows
        base_strength += 5
    
    # Combine with AI confidence and suggestion, adjust score.
    base_strength += int((ai_score - 0.5) * 20) # Boost or reduce based on AI score

    return min(100, max(30, base_strength)) # Cap score between 30 and 100


def analyze_disk_health_performance(disk_data: dict, system_context: dict):
    """Analyzes disk performance aspects that might impact encryption choice."""
    # This part can involve integrating tools to read actual disk speeds, which is tricky.
    # Psutil can give basic counters, but raw speeds need specific disk I/O benchmarks.
    # For now, using simple heuristics based on known properties.
    
    # Disk properties for analysis
    disk_is_ssd = get_disk_media_type_windows(disk_data.get('description', '')) # Placeholder method
    if not disk_is_ssd and os.name != 'nt': # Crude check for non-Windows systems if 'SSD' wasn't in description
         # Attempt detection on Linux/Mac if not available - harder via Python standard libs.
         pass

    disk_size_gb = disk_data.get('size', 0) / (1024**3)
    file_system = disk_data.get('fileSystem', 'Unknown').upper()

    # What affects performance most?
    # - Cipher complexity: AES-256 is fast, Serpent is slow but strong. Cascades are slowest.
    # - Disk speed: SSDs are better for encryption than HDDs. NVMe >> SATA SSD >> HDD.
    # - CPU speed: Encryption algorithms are CPU intensive. Faster CPU, less impact.
    # - Data density: Encrypting a nearly full disk might be slower.

    # Return simple metrics
    return {
        "is_ssd": disk_is_ssd,
        "size_gb": disk_size_gb,
        "file_system": file_system,
        # "estimated_performance_impact": None # Could calculate if more data is available
    }

# --- Main AI Analysis Function ---
def get_ai_recommendations(disk_info: dict, system_context: dict) -> dict:
    """
    Main function orchestrating AI analysis for disk encryption recommendations.
    Args:
        disk_info (dict): Detailed info about the target disk.
        system_context (dict): Info about the OS, user, etc.
    Returns:
        dict: AI recommendations.
    """
    start_time = time.time()
    print(f"INFO: Starting AI analysis for disk: {disk_info.get('caption', 'Unknown')}", file=sys.stderr)
    
    recommendations = {
        "algorithm": "AES-256",
        "password_strength_score": 75,
        "suggest_usb_key": False,
        "suggest_hidden_volume": False,
        "explanation": "",
        "confidence_score": 0.5,
        "ai_run_time_ms": 0
    }
    
    try:
        # --- Feature Extraction ---
        disk_features = analyze_disk_health_performance(disk_info, system_context)
        disk_size_gb = disk_features["size_gb"]
        is_ssd = disk_features["is_ssd"]
        file_system = disk_features["file_system"]
        
        user_os = system_context.get('platform', 'Unknown OS')

        # --- Rule-Based Heuristics (for baseline or if ML fails) ---
        # Higher score for security needs, lower for performance needs
        security_score_factor = 0.5 # Default balance
        if disk_size_gb > 1000: security_score_factor += 0.1 # Large drives benefit more from strong security
        if is_ssd: security_score_factor += 0.05 # SSDs handle encryption overhead better
        if user_os.startswith('Windows') and system_context.get('uefiSecureBoot', False): security_score_factor += 0.05 # Secure OS often implies security focus

        recommendations["security_focus_factor"] = security_score_factor

        # --- Algorithmic Recommendations ---
        if security_score_factor > 0.7:
            recommendations["algorithm"] = "AES-Serpent-Twofish"
            recommendations["suggest_usb_key"] = True
            recommendations["explanation"] = "High security focus detected. Recommended cascaded ciphers (AES-Serpent-Twofish) for maximum protection and a USB key for access control."
            recommendations["confidence_score"] = 0.7
        elif security_score_factor > 0.6:
            recommendations["algorithm"] = "Serpent"
            recommendations["suggest_hidden_volume"] = True
            recommendations["explanation"] = "Strong security is prioritized. Serpent cipher offers high security with moderate performance impact. Consider a hidden volume for advanced privacy."
            recommendations["confidence_score"] = 0.65
        else: # Balanced or performance
            recommendations["algorithm"] = "AES-256"
            recommendations["explanation"] = "Balanced approach for security and performance. AES-256 is a robust and widely accepted standard."
            recommendations["confidence_score"] = 0.55
            if disk_size_gb < 500 and not is_ssd: # Smaller, slower drives might benefit from simpler AES
                 recommendations["explanation"] += " For smaller HDDs, AES-256 is a good balance."


        # --- Password Strength Recommendation ---
        recommendations["password_strength_score"] = suggest_password_strength(disk_size_gb, user_os, recommendations["confidence_score"])
        if recommendations["password_strength_score"] > 85:
             recommendations["explanation"] += "\nAim for a very strong password (long passphrase recommended)."
        elif recommendations["password_strength_score"] > 70:
            recommendations["explanation"] += "\nEnsure password complexity for good security."
            
        # --- Integrating ML Model (Example) ---
        if TRANSFORMERS_AVAILABLE:
            try:
                print("INFO: Running Zero-shot classification with Transformers...", file=sys.stderr)
                classifier = pipeline("zero-shot-classification", model=MODEL_CONFIG["recommendation_pipeline"]["model_name"])
                
                model_input = (f"Optimize encryption for disk {disk_info.get('caption', '')}: {disk_size_gb:.1f}GB, "
                               f"{disk_features.get('file_system', 'N/A')}, {'SSD' if disk_features.get('is_ssd') else 'HDD'}. "
                               f"User OS context: {user_os}. User seems to prioritize security over raw speed. "
                               f"Suggest an encryption approach.")
                               
                model_results = classifier(
                    model_input,
                    MODEL_CONFIG["recommendation_pipeline"]["labels"],
                    **MODEL_CONFIG["recommendation_pipeline"]["preprocessor_args"]
                )

                # Analyze ML results and potentially override heuristics
                # This requires understanding model output nuances
                if model_results and model_results.get('labels'):
                    best_label = model_results['labels'][0]
                    best_score = model_results['scores'][0]
                    print(f"INFO: ML Classification Result: {best_label} ({best_score:.2f})", file=sys.stderr)

                    # Merge ML findings with heuristic results
                    current_confidence = recommendations["confidence_score"]
                    
                    if best_label == "security_focused" and best_score > 0.7:
                        recommendations["confidence_score"] = max(current_confidence, best_score)
                        if recommendations["algorithm"] not in ["AES-Serpent-Twofish", "Serpent"]:
                            recommendations["algorithm"] = "AES-Serpent-Twofish" # Strongest available
                        recommendations["suggest_usb_key"] = True
                        recommendations["explanation"] = f"(AI agrees: prioritize security) {recommendations['explanation'].splitlines()[0]}"
                    
                    elif best_label == "performance_balanced" and best_score > 0.7:
                        recommendations["confidence_score"] = max(current_confidence, best_score)
                        if recommendations["algorithm"] == "AES-Serpent-Twofish":
                            recommendations["algorithm"] = "AES-256" # Switch to balanced
                        if recommendations["suggest_usb_key"]:
                            recommendations["suggest_usb_key"] = False
                        recommendations["explanation"] = f"(AI suggests balance) {recommendations['explanation'].splitlines()[0]}"
                        
                    # Adjust explanation based on ML feedback
                    if "AI agrees" in recommendations["explanation"] and recommendations["algorithm"] in ["AES-Serpent-Twofish", "Serpent"]:
                        pass # Keep explanation as is
                    elif recommendations["algorithm"] == "AES-256" and "AI suggests balance" in recommendations["explanation"]:
                        pass # Keep as is
                    else: # Generic explanation if ML suggestion is generic
                        pass

            except Exception as ml_error:
                print(f"WARNING: Failed to run ML model: {ml_error}", file=sys.stderr)
                recommendations["explanation"] += "\n(Advanced AI analysis failed; using heuristic recommendations.)"

        # --- Final Confidence and Explanation Adjustment ---
        # Normalize confidence if ML affected it significantly
        final_confidence = recommendations.get("confidence_score", 0.5)
        if final_confidence > 0.8 and not "AI agrees" in recommendations["explanation"]:
            recommendations["explanation"] += "\n(AI strongly recommends these settings.)"
        elif final_confidence < 0.5 and recommendations["algorithm"] != "AES-256":
            recommendations["explanation"] += "\n(AI confidence is low; review settings carefully.)"


    except Exception as e:
        print(f"ERROR: Unexpected exception in AI analysis: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        recommendations["error"] = str(e)
        recommendations["algorithm"] = "AI Error"
        recommendations["confidence_score"] = 0.0
        recommendations["explanation"] = "An internal error occurred during AI analysis."

    finally:
        end_time = time.time()
        recommendations["ai_run_time_ms"] = int((end_time - start_time) * 1000)
        
    return recommendations

# --- Main execution block ---
if __name__ == "__main__":
    # Ensure correct path handling for models and libraries, especially if running as bundled app.
    # Consider using a virtual environment or `python -m`.
    
    if len(sys.argv) < 2:
        print("Usage: python disk_analyzer.py <json_disk_info> [<json_system_context>]", file=sys.stderr)
        sys.exit(1)

    disk_info_str = sys.argv[1]
    system_context_str = sys.argv[2] if len(sys.argv) > 2 else "{}"

    try:
        disk_data = json.loads(disk_info_str)
        system_data = json.loads(system_context_str)

        if not isinstance(disk_data, dict) or not isinstance(system_data, dict):
            raise ValueError("Invalid JSON data format received.")

        # Validate basic disk_data structure if necessary
        if not all(k in disk_data for k in ('caption', 'size', 'driveType')):
            print("WARNING: Disk data may be incomplete.", file=sys.stderr)

        analysis_results = get_ai_recommendations(disk_data, system_data)
        print(json.dumps(analysis_results)) # Print results to stdout for Electron to capture

    except json.JSONDecodeError:
        print("Error: Could not decode JSON argument.", file=sys.stderr)
        sys.exit(1)
    except ValueError as ve:
        print(f"Error: {ve}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred in main execution: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
