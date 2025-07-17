import { useState, useEffect, useCallback } from "react";

export interface ServiceStatus {
  id: string;
  name: string;
  status: "running" | "stopped" | "starting" | "error";
  cpu: number;
  memory: number;
  operations: number;
  uptime: number;
  lastActivity: Date;
  errors: number;
  warnings: number;
}

export interface SystemMetrics {
  totalCPU: number;
  totalMemory: number;
  totalOperations: number;
  activeServices: number;
  totalServices: number;
  systemHealth: number;
}

export const useServiceMonitor = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      id: "aes-cipher",
      name: "AES-256 Cipher",
      status: "running",
      cpu: 45,
      memory: 68,
      operations: 1247,
      uptime: 3600000, // 1 hour in ms
      lastActivity: new Date(),
      errors: 0,
      warnings: 2,
    },
    {
      id: "serpent-cipher",
      name: "Serpent Cipher",
      status: "running",
      cpu: 32,
      memory: 54,
      operations: 892,
      uptime: 2400000, // 40 minutes in ms
      lastActivity: new Date(Date.now() - 5000),
      errors: 0,
      warnings: 0,
    },
    {
      id: "twofish-cipher",
      name: "Twofish Cipher",
      status: "stopped",
      cpu: 0,
      memory: 12,
      operations: 0,
      uptime: 0,
      lastActivity: new Date(Date.now() - 600000), // 10 minutes ago
      errors: 0,
      warnings: 1,
    },
    {
      id: "triple-cipher",
      name: "Triple Cipher",
      status: "starting",
      cpu: 78,
      memory: 85,
      operations: 2156,
      uptime: 60000, // 1 minute
      lastActivity: new Date(Date.now() - 1000),
      errors: 0,
      warnings: 0,
    },
    {
      id: "system-analyzer",
      name: "System Analyzer",
      status: "running",
      cpu: 23,
      memory: 41,
      operations: 156,
      uptime: 7200000, // 2 hours
      lastActivity: new Date(Date.now() - 3000),
      errors: 1,
      warnings: 3,
    },
    {
      id: "ai-assistant",
      name: "AI Assistant",
      status: "running",
      cpu: 67,
      memory: 72,
      operations: 45,
      uptime: 1800000, // 30 minutes
      lastActivity: new Date(),
      errors: 0,
      warnings: 1,
    },
  ]);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalCPU: 0,
    totalMemory: 0,
    totalOperations: 0,
    activeServices: 0,
    totalServices: 6,
    systemHealth: 100,
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  // Calculate system metrics based on services
  const calculateSystemMetrics = useCallback(
    (serviceList: ServiceStatus[]): SystemMetrics => {
      const activeServices = serviceList.filter(
        (s) => s.status === "running" || s.status === "starting",
      );
      const totalCPU =
        activeServices.reduce((sum, s) => sum + s.cpu, 0) /
        Math.max(activeServices.length, 1);
      const totalMemory =
        activeServices.reduce((sum, s) => sum + s.memory, 0) /
        Math.max(activeServices.length, 1);
      const totalOperations = serviceList.reduce(
        (sum, s) => sum + s.operations,
        0,
      );
      const totalErrors = serviceList.reduce((sum, s) => sum + s.errors, 0);
      const totalWarnings = serviceList.reduce((sum, s) => sum + s.warnings, 0);

      // Calculate system health (100% - penalties for errors/warnings)
      const systemHealth = Math.max(
        0,
        100 - totalErrors * 10 - totalWarnings * 3,
      );

      return {
        totalCPU: Math.round(totalCPU),
        totalMemory: Math.round(totalMemory),
        totalOperations,
        activeServices: activeServices.length,
        totalServices: serviceList.length,
        systemHealth,
      };
    },
    [],
  );

  // Simulate real-time updates
  const updateServices = useCallback(() => {
    setServices((prevServices) => {
      const updatedServices = prevServices.map((service) => {
        if (service.status === "running" || service.status === "starting") {
          // Simulate natural fluctuations
          const cpuVariation = (Math.random() - 0.5) * 20; // ±10%
          const memoryVariation = (Math.random() - 0.5) * 10; // ±5%
          const operationsVariation = Math.floor((Math.random() - 0.5) * 200); // ±100 ops

          const newCpu = Math.max(5, Math.min(95, service.cpu + cpuVariation));
          const newMemory = Math.max(
            10,
            Math.min(90, service.memory + memoryVariation),
          );
          const newOperations = Math.max(
            0,
            service.operations + operationsVariation,
          );

          // Update uptime
          const newUptime = service.uptime + 2000; // Add 2 seconds

          // Randomly update last activity for running services
          const shouldUpdateActivity = Math.random() > 0.7; // 30% chance
          const newLastActivity = shouldUpdateActivity
            ? new Date()
            : service.lastActivity;

          // Randomly add errors/warnings (very low chance)
          const shouldAddError = Math.random() > 0.995; // 0.5% chance
          const shouldAddWarning = Math.random() > 0.99; // 1% chance

          return {
            ...service,
            cpu: Math.round(newCpu),
            memory: Math.round(newMemory),
            operations: newOperations,
            uptime: newUptime,
            lastActivity: newLastActivity,
            errors: service.errors + (shouldAddError ? 1 : 0),
            warnings: service.warnings + (shouldAddWarning ? 1 : 0),
          };
        }

        // For stopped services, occasionally change status
        if (service.status === "stopped" && Math.random() > 0.98) {
          // 2% chance to start
          return {
            ...service,
            status: "starting",
            cpu: Math.floor(Math.random() * 20) + 10,
            memory: Math.floor(Math.random() * 30) + 20,
            operations: Math.floor(Math.random() * 100),
            lastActivity: new Date(),
          };
        }

        // For starting services, transition to running after some time
        if (service.status === "starting" && service.uptime > 30000) {
          // After 30 seconds
          return {
            ...service,
            status: "running",
          };
        }

        return service;
      });

      return updatedServices;
    });
  }, []);

  // Start/stop monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Service control functions
  const startService = useCallback((serviceId: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              status: "starting",
              lastActivity: new Date(),
              uptime: 0,
            }
          : service,
      ),
    );
  }, []);

  const stopService = useCallback((serviceId: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              status: "stopped",
              cpu: 0,
              operations: 0,
              uptime: 0,
            }
          : service,
      ),
    );
  }, []);

  const restartService = useCallback(
    (serviceId: string) => {
      stopService(serviceId);
      setTimeout(() => startService(serviceId), 1000);
    },
    [startService, stopService],
  );

  // Effect for real-time updates
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(updateServices, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, [isMonitoring, updateServices]);

  // Update system metrics when services change
  useEffect(() => {
    setSystemMetrics(calculateSystemMetrics(services));
  }, [services, calculateSystemMetrics]);

  // Auto-start monitoring
  useEffect(() => {
    startMonitoring();
    return stopMonitoring;
  }, [startMonitoring, stopMonitoring]);

  return {
    services,
    systemMetrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    startService,
    stopService,
    restartService,
  };
};

export default useServiceMonitor;
