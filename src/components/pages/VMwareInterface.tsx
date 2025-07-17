import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface VirtualMachine {
  id: string;
  name: string;
  status: "running" | "stopped" | "suspended";
  powerStatus: string;
  memory: string;
  cpu: { cores: string; usage: number };
  disk: { size: string; usage: number };
  memoryUsage: number;
  notes: string;
  ipAddresses: string[];
  dnsName: string;
  compatibility: string;
  path: string;
  tags: Array<{ name: string; color: string }>;
  hardware: Array<{
    icon: React.ReactNode;
    name: string;
    value: string;
    details?: string;
  }>;
}

const VMwareInterface: React.FC = () => {
  const [selectedVM, setSelectedVM] = useState<string>("windows10");
  const [openedVMs, setOpenedVMs] = useState<string[]>(["windows10"]);

  const virtualMachines: VirtualMachine[] = [
    {
      id: "windows11",
      name: "Windows 11",
      status: "stopped",
      powerStatus: "Powered Off",
      memory: "8 GB",
      cpu: { cores: "1 / 4", usage: 0 },
      disk: { size: "120 GB", usage: 0 },
      memoryUsage: 0,
      notes: "Development environment",
      ipAddresses: [],
      dnsName: "Unknown",
      compatibility: "Workstation 17",
      path: "D:\\VMs\\Windows11\\Windows11.vmx",
      tags: [
        { name: "Dev", color: "#4EB4FF" },
        { name: "test", color: "#F38B00" },
      ],
      hardware: [],
    },
    {
      id: "windows10",
      name: "Windows 10 x64",
      status: "running",
      powerStatus: "Powered On",
      memory: "12 GB",
      cpu: { cores: "1 / 8", usage: 46 },
      disk: { size: "256 GB", usage: 30 },
      memoryUsage: 71,
      notes: "win10 skull test",
      ipAddresses: [
        "192.168.1.56",
        "192.168.2.1",
        "10.151.56.79",
        "fe80:4fa3:82ee::",
      ],
      dnsName: "Unknown",
      compatibility: "Workstation 18",
      path: "D:\\VMs\\Windows10_x64\\Windows10_x64.vmx",
      tags: [
        { name: "Work", color: "#FF1818" },
        { name: "testvms", color: "#FFDA18" },
        { name: "windows", color: "#2DB3FF" },
        { name: "skull", color: "#2DA7FF" },
      ],
      hardware: [
        {
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M1.25 4.375V15.625H9.375V15C9.375 14.6531 9.65312 14.375 10 14.375C10.3469 14.375 10.625 14.6531 10.625 15V15.625H18.75V4.375H1.25ZM2.5 5.625H17.5V11.25H2.5V5.625ZM3.75 6.875V10H7.5V6.875H3.75ZM8.125 6.875V10H11.875V6.875H8.125ZM12.5 6.875V10H16.25V6.875H12.5ZM5 8.125H6.25V8.75H5V8.125ZM9.375 8.125H10.625V8.75H9.375V8.125ZM13.75 8.125H15V8.75H13.75V8.125ZM2.5 12.5H17.5V14.375H11.6213C11.345 13.6812 10.7863 13.125 10 13.125C9.21375 13.125 8.655 13.6812 8.37875 14.375H2.5V12.5Z"
                fill="white"
              />
            </svg>
          ),
          name: "Memory",
          value: "12 GB",
        },
        {
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.822 12.8167H6.71094V13.65H13.2387C13.3492 13.65 13.4552 13.6061 13.5333 13.528C13.6115 13.4498 13.6554 13.3438 13.6554 13.2333V6.29443H12.822V12.8167Z"
                fill="white"
              />
              <path
                d="M17.8887 10.0833C18.0066 10.0833 18.1196 10.0365 18.203 9.95315C18.2863 9.8698 18.3332 9.75675 18.3332 9.63888C18.3332 9.521 18.2863 9.40796 18.203 9.32461C18.1196 9.24126 18.0066 9.19443 17.8887 9.19443H16.6665V6.19443H17.8887C18.0066 6.19443 18.1196 6.14761 18.203 6.06426C18.2863 5.98091 18.3332 5.86786 18.3332 5.74999C18.3332 5.63212 18.2863 5.51907 18.203 5.43572C18.1196 5.35237 18.0066 5.30555 17.8887 5.30555H16.6665V4.49999C16.6665 4.19057 16.5436 3.89382 16.3248 3.67503C16.106 3.45624 15.8093 3.33332 15.4998 3.33332H14.6387V2.1111C14.6387 1.99323 14.5919 1.88018 14.5085 1.79683C14.4252 1.71348 14.3122 1.66666 14.1943 1.66666C14.0764 1.66666 13.9634 1.71348 13.88 1.79683C13.7967 1.88018 13.7498 1.99323 13.7498 2.1111V3.33332H10.7498V2.1111C10.7498 1.99323 10.703 1.88018 10.6197 1.79683C10.5363 1.71348 10.4233 1.66666 10.3054 1.66666C10.1875 1.66666 10.0745 1.71348 9.99112 1.79683C9.90777 1.88018 9.86095 1.99323 9.86095 2.1111V3.33332H6.86095V2.1111C6.86095 1.99323 6.81412 1.88018 6.73077 1.79683C6.64742 1.71348 6.53438 1.66666 6.4165 1.66666C6.29863 1.66666 6.18558 1.71348 6.10223 1.79683C6.01888 1.88018 5.97206 1.99323 5.97206 2.1111V3.33332H4.49984C4.19042 3.33332 3.89367 3.45624 3.67488 3.67503C3.45609 3.89382 3.33317 4.19057 3.33317 4.49999V5.30555H2.11095C1.99307 5.30555 1.88003 5.35237 1.79668 5.43572C1.71333 5.51907 1.6665 5.63212 1.6665 5.74999C1.6665 5.86786 1.71333 5.98091 1.79668 6.06426C1.88003 6.14761 1.99307 6.19443 2.11095 6.19443H3.33317V9.19443H2.11095C1.99307 9.19443 1.88003 9.24126 1.79668 9.32461C1.71333 9.40796 1.6665 9.521 1.6665 9.63888C1.6665 9.75675 1.71333 9.8698 1.79668 9.95315C1.88003 10.0365 1.99307 10.0833 2.11095 10.0833H3.33317V13.0833H2.11095C1.99307 13.0833 1.88003 13.1301 1.79668 13.2135C1.71333 13.2968 1.6665 13.4099 1.6665 13.5278C1.6665 13.6456 1.71333 13.7587 1.79668 13.842C1.88003 13.9254 1.99307 13.9722 2.11095 13.9722H3.33317V15.5C3.33317 15.8094 3.45609 16.1062 3.67488 16.3249C3.89367 16.5437 4.19042 16.6667 4.49984 16.6667H5.97206V17.8889C5.97206 18.0068 6.01888 18.1198 6.10223 18.2031C6.18558 18.2865 6.29863 18.3333 6.4165 18.3333C6.53438 18.3333 6.64742 18.2865 6.73077 18.2031C6.81412 18.1198 6.86095 18.0068 6.86095 17.8889V16.6667H9.86095V17.8889C9.86095 18.0068 9.90777 18.1198 9.99112 18.2031C10.0745 18.2865 10.1875 18.3333 10.3054 18.3333C10.4233 18.3333 10.5363 18.2865 10.6197 18.2031C10.703 18.1198 10.7498 18.0068 10.7498 17.8889V16.6667H13.7498V17.8889C13.7498 18.0068 13.7967 18.1198 13.88 18.2031C13.9634 18.2865 14.0764 18.3333 14.1943 18.3333C14.3122 18.3333 14.4252 18.2865 14.5085 18.2031C14.5919 18.1198 14.6387 18.0068 14.6387 17.8889V16.6667H15.4998C15.8093 16.6667 16.106 16.5437 16.3248 16.3249C16.5436 16.1062 16.6665 15.8094 16.6665 15.5V13.9722H17.8887C18.0066 13.9722 18.1196 13.9254 18.203 13.842C18.2863 13.7587 18.3332 13.6456 18.3332 13.5278C18.3332 13.4099 18.2863 13.2968 18.203 13.2135C18.1196 13.1301 18.0066 13.0833 17.8887 13.0833H16.6665V10.0833H17.8887Z"
                fill="white"
              />
            </svg>
          ),
          name: "Processors / Cores",
          value: "1 / 8",
        },
        {
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M1.875 5.625C1.875 5.45924 1.94085 5.30027 2.05806 5.18306C2.17527 5.06585 2.33424 5 2.5 5H19.375C19.5408 5 19.6997 5.06585 19.8169 5.18306C19.9342 5.30027 20 5.45924 20 5.625V8.75C20 8.91576 19.9342 9.07473 19.8169 9.19194C19.6997 9.30915 19.5408 9.375 19.375 9.375C19.2092 9.375 19.0503 9.44085 18.9331 9.55806C18.8158 9.67527 18.75 9.83424 18.75 10C18.75 10.1658 18.8158 10.3247 18.9331 10.4419C19.0503 10.5592 19.2092 10.625 19.375 10.625C19.5408 10.625 19.6997 10.6908 19.8169 10.8081C19.9342 10.9253 20 11.0842 20 11.25V14.375C20 14.5408 19.9342 14.6997 19.8169 14.8169C19.6997 14.9342 19.5408 15 19.375 15H2.5C2.33424 15 2.17527 14.9342 2.05806 14.8169C1.94085 14.6997 1.875 14.5408 1.875 14.375H0.625C0.45924 14.375 0.300269 14.3092 0.183058 14.1919C0.065848 14.0747 0 13.9158 0 13.75V9.375C0 9.20924 0.065848 9.05027 0.183058 8.93306C0.300269 8.81585 0.45924 8.75 0.625 8.75H1.875C1.95788 8.75 2.03737 8.71708 2.09597 8.65847C2.15458 8.59987 2.1875 8.52038 2.1875 8.4375C2.1875 8.35462 2.15458 8.27513 2.09597 8.21653C2.03737 8.15792 1.95788 8.125 1.875 8.125H0.625C0.45924 8.125 0.300269 8.05915 0.183058 7.94194C0.065848 7.82473 0 7.66576 0 7.5V6.25C0 6.08424 0.065848 5.92527 0.183058 5.80806C0.300269 5.69085 0.45924 5.625 0.625 5.625H1.875Z"
                fill="white"
              />
              <path
                d="M5 8.125C5 7.95924 5.06585 7.80027 5.18306 7.68306C5.30027 7.56585 5.45924 7.5 5.625 7.5H8.125C8.29076 7.5 8.44973 7.56585 8.56694 7.68306C8.68415 7.80027 8.75 7.95924 8.75 8.125V11.875C8.75 12.0408 8.68415 12.1997 8.56694 12.3169C8.44973 12.4342 8.29076 12.5 8.125 12.5H5.625C5.45924 12.5 5.30027 12.4342 5.18306 12.3169C5.06585 12.1997 5 12.0408 5 11.875V8.125ZM6.25 8.75V11.25H7.5V8.75H6.25ZM10 8.125C10 7.95924 10.0658 7.80027 10.1831 7.68306C10.3003 7.56585 10.4592 7.5 10.625 7.5H15.625C15.7908 7.5 15.9497 7.56585 16.0669 7.68306C16.1842 7.80027 16.25 7.95924 16.25 8.125V11.875C16.25 12.0408 16.1842 12.1997 16.0669 12.3169C15.9497 12.4342 15.7908 12.5 15.625 12.5H10.625C10.4592 12.5 10.3003 12.4342 10.1831 12.3169C10.0658 12.1997 10 12.0408 10 11.875V8.125ZM11.25 8.75V11.25H15V8.75H11.25Z"
                fill="white"
              />
            </svg>
          ),
          name: "NVME Disk",
          value: "256 GB",
        },
        {
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M9.99984 1.66666C8.35166 1.66666 6.7405 2.1554 5.37009 3.07108C3.99968 3.98675 2.93158 5.28824 2.30084 6.81096C1.67011 8.33368 1.50509 10.0092 1.82663 11.6257C2.14817 13.2423 2.94185 14.7271 4.10728 15.8925C5.27272 17.058 6.75758 17.8517 8.37409 18.1732C9.9906 18.4947 11.6662 18.3297 13.1889 17.699C14.7116 17.0683 16.0131 16.0002 16.9288 14.6297C17.8444 13.2593 18.3332 11.6482 18.3332 9.99999C18.3332 8.90564 18.1176 7.82201 17.6988 6.81096C17.28 5.79991 16.6662 4.88125 15.8924 4.10743C15.1186 3.33361 14.1999 2.71978 13.1889 2.30099C12.1778 1.8822 11.0942 1.66666 9.99984 1.66666Z"
                fill="white"
              />
              <path
                d="M9.99984 6.66666C9.34057 6.66666 8.6961 6.86215 8.14794 7.22842C7.59977 7.5947 7.17253 8.11529 6.92024 8.72438C6.66795 9.33347 6.60194 10.0037 6.73055 10.6503C6.85917 11.2969 7.17664 11.8908 7.64282 12.357C8.10899 12.8232 8.70293 13.1407 9.34954 13.2693C9.99614 13.3979 10.6664 13.3319 11.2755 13.0796C11.8845 12.8273 12.4051 12.4001 12.7714 11.8519C13.1377 11.3037 13.3332 10.6593 13.3332 9.99999C13.3332 9.11593 12.982 8.26809 12.3569 7.64297C11.7317 7.01785 10.8839 6.66666 9.99984 6.66666Z"
                fill="white"
              />
            </svg>
          ),
          name: "SATA DVD Disc",
          value: "en-us_windows_10_22h2_x64.iso",
          details: "ISO File",
        },
        {
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M14.7665 17.7778H4.76649C4.61915 17.7778 4.47784 17.8363 4.37366 17.9405C4.26947 18.0447 4.21094 18.186 4.21094 18.3333C4.21094 18.4807 4.26947 18.622 4.37366 18.7262C4.47784 18.8304 4.61915 18.8889 4.76649 18.8889H14.7665C14.9138 18.8889 15.0551 18.8304 15.1593 18.7262C15.2635 18.622 15.322 18.4807 15.322 18.3333C15.322 18.186 15.2635 18.0447 15.1593 17.9405C15.0551 17.8363 14.9138 17.7778 14.7665 17.7778Z"
                fill="white"
              />
              <path
                d="M9.86127 1.11112C7.79848 1.11112 5.82017 1.93056 4.36155 3.38917C2.90294 4.84779 2.0835 6.8261 2.0835 8.88889C2.0835 9.13889 2.0835 9.38334 2.12238 9.62778C2.26555 11.1279 2.84142 12.5542 3.78001 13.7332C4.71859 14.9121 5.97946 15.7931 7.40934 16.2688C8.83921 16.7446 10.3765 16.7948 11.8344 16.4132C13.2922 16.0316 14.6078 15.2348 15.6213 14.1195C16.6347 13.0042 17.3023 11.6185 17.543 10.1309C17.7836 8.64327 17.5869 7.11778 16.9768 5.73986C16.3666 4.36194 15.3694 3.19094 14.1061 2.3692C12.8429 1.54747 11.3682 1.1104 9.86127 1.11112Z"
                fill="white"
              />
            </svg>
          ),
          name: "Network Adapter",
          value: "NAT",
        },
        {
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M19.2891 9.65001L16.228 7.81112C16.1685 7.77615 16.101 7.75737 16.032 7.75665C15.9631 7.75593 15.8951 7.7733 15.835 7.80702C15.7748 7.84075 15.7246 7.88966 15.6892 7.94886C15.6539 8.00807 15.6347 8.07551 15.6335 8.14446V9.44446H6.53908L8.49464 6.33334C8.56853 6.21093 8.67287 6.10975 8.79749 6.03965C8.92211 5.96955 9.06277 5.93292 9.20575 5.93334H10.1169C10.2081 6.19276 10.3771 6.41778 10.6007 6.57781C10.8244 6.73784 11.0919 6.82512 11.3669 6.82779C11.7164 6.80556 12.0444 6.65102 12.2841 6.3956C12.5238 6.14018 12.6572 5.80306 12.6572 5.45279C12.6572 5.10252 12.5238 4.7654 12.2841 4.50998C12.0444 4.25456 11.7164 4.10002 11.3669 4.07779C11.1198 4.07891 10.8779 4.14924 10.6688 4.28083C10.4596 4.41241 10.2915 4.59997 10.1835 4.82223H9.20575C8.87207 4.81954 8.54334 4.90301 8.25136 5.06457C7.95938 5.22613 7.71405 5.46031 7.53908 5.74446L5.22797 9.44446H4.44464C4.29373 9.00874 3.99122 8.64179 3.59228 8.41054C3.19335 8.17929 2.72458 8.09915 2.27148 8.18474C1.81838 8.27033 1.41115 8.51594 1.12406 8.87678C0.836972 9.23762 0.689162 9.68964 0.707592 10.1504C0.726021 10.6111 0.909462 11.0499 1.22445 11.3866C1.53945 11.7234 1.965 11.9357 2.42349 11.9848C2.88197 12.034 3.34284 11.9166 3.72203 11.6543C4.10122 11.3919 4.37346 11.0019 4.48908 10.5556H7.62242L9.92797 14.2333C10.1029 14.5175 10.3483 14.7517 10.6402 14.9132C10.9322 15.0748 11.261 15.1583 11.5946 15.1556H13.0335V15.6667H15.478V13.2222H13.0335V14.0445H11.6002C11.4574 14.0438 11.3172 14.0067 11.1927 13.9367C11.0683 13.8667 10.9638 13.7661 10.8891 13.6445L8.9502 10.5556H15.6169V11.8222C15.617 11.8914 15.6357 11.9593 15.6708 12.0188C15.706 12.0784 15.7564 12.1275 15.8169 12.1611C15.8747 12.1931 15.9396 12.2103 16.0057 12.2111C16.0764 12.2126 16.146 12.1933 16.2058 12.1556L19.2724 10.3167C19.3299 10.2821 19.3775 10.2332 19.4106 10.1748C19.4436 10.1164 19.461 10.0505 19.461 9.98334C19.461 9.91623 19.4436 9.85027 19.4106 9.79185C19.3775 9.73344 19.3299 9.68458 19.2724 9.65001H19.2891Z"
                fill="white"
              />
            </svg>
          ),
          name: "USB Controller",
          value: "USB 3.2",
        },
        {
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M9.80351 17.68C10.3724 17.68 10.7824 17.2614 10.7824 16.7007V3.34965C10.7824 2.78894 10.3724 2.32001 9.78637 2.32001C9.37637 2.32001 9.10851 2.52108 8.65637 2.92286L4.72244 6.41322C4.67208 6.46322 4.59673 6.48858 4.51316 6.48858H2.02708C0.838513 6.48858 0.252441 7.08286 0.252441 8.34679V11.6786C0.252441 12.9429 0.838156 13.5368 2.02708 13.5368H4.5128C4.59673 13.5368 4.67208 13.5618 4.72244 13.6122L8.65637 17.1364C9.06673 17.5043 9.39316 17.6804 9.80316 17.6804M17.0353 15.9729C17.3614 16.1904 17.7632 16.1068 17.9978 15.7718C19.1024 14.2318 19.7471 12.1811 19.7471 10.0382C19.7471 7.88679 19.111 5.83608 17.9978 4.29572C17.7549 3.96929 17.3614 3.88572 17.0349 4.10322C16.7171 4.32108 16.6667 4.73108 16.9178 5.09108C17.8303 6.43036 18.3996 8.18822 18.3996 10.0382C18.3996 11.8882 17.8471 13.6625 16.9178 14.985C16.6749 15.345 16.7174 15.755 17.0353 15.9729Z"
                fill="white"
              />
            </svg>
          ),
          name: "Sound Card",
          value: "HD Audio",
        },
        {
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M18.0558 1.66666H1.94466C1.72365 1.66666 1.51169 1.75445 1.35541 1.91073C1.19913 2.06701 1.11133 2.27898 1.11133 2.49999V14.1667C1.11133 14.3877 1.19913 14.5996 1.35541 14.7559C1.51169 14.9122 1.72365 15 1.94466 15H18.0558C18.2768 15 18.4887 14.9122 18.645 14.7559C18.8013 14.5996 18.8891 14.3877 18.8891 14.1667V2.49999C18.8891 2.27898 18.8013 2.06701 18.645 1.91073C18.4887 1.75445 18.2768 1.66666 18.0558 1.66666ZM17.778 13.8889H2.22244V2.77777H17.778V13.8889Z"
                fill="white"
              />
              <path
                d="M4.27756 4.86667H15.6276L16.6331 3.97778H3.38867V12.7778H4.27756V4.86667Z"
                fill="white"
              />
            </svg>
          ),
          name: "Display",
          value: "Auto Detect (1GB vGPU)",
        },
        {
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M14.1667 2.5H5.83333C5.3731 2.5 5 2.8731 5 3.33333V16.6667C5 17.1269 5.3731 17.5 5.83333 17.5H14.1667C14.6269 17.5 15 17.1269 15 16.6667V3.33333C15 2.8731 14.6269 2.5 14.1667 2.5Z"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="M5 5H2.5M5 8.33333H2.5M5 11.6667H2.5M5 15H2.5M17.5 5H15M17.5 8.33333H15M17.5 11.6667H15M17.5 15H15"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          name: "TPM Chip",
          value: "2.0",
        },
      ],
    },
    {
      id: "vmw-dev",
      name: "VMW-DEV-L2",
      status: "stopped",
      powerStatus: "Powered Off",
      memory: "4 GB",
      cpu: { cores: "1 / 2", usage: 0 },
      disk: { size: "80 GB", usage: 0 },
      memoryUsage: 0,
      notes: "Development VM",
      ipAddresses: [],
      dnsName: "Unknown",
      compatibility: "Workstation 17",
      path: "D:\\VMs\\VMW-DEV-L2\\VMW-DEV-L2.vmx",
      tags: [{ name: "Dev", color: "#4EB4FF" }],
      hardware: [],
    },
    {
      id: "ubuntu",
      name: "Ubuntu 24.04",
      status: "stopped",
      powerStatus: "Powered Off",
      memory: "6 GB",
      cpu: { cores: "1 / 4", usage: 0 },
      disk: { size: "100 GB", usage: 0 },
      memoryUsage: 0,
      notes: "Linux development",
      ipAddresses: [],
      dnsName: "Unknown",
      compatibility: "Workstation 17",
      path: "D:\\VMs\\Ubuntu\\Ubuntu.vmx",
      tags: [
        { name: "Linux", color: "#4EB4FF" },
        { name: "Dev", color: "#2DB3FF" },
      ],
      hardware: [],
    },
    {
      id: "winxp",
      name: "windows xp test",
      status: "stopped",
      powerStatus: "Powered Off",
      memory: "1 GB",
      cpu: { cores: "1 / 1", usage: 0 },
      disk: { size: "40 GB", usage: 0 },
      memoryUsage: 0,
      notes: "Legacy testing",
      ipAddresses: [],
      dnsName: "Unknown",
      compatibility: "Workstation 15",
      path: "D:\\VMs\\WindowsXP\\WindowsXP.vmx",
      tags: [
        { name: "Legacy", color: "#FF6A49" },
        { name: "Test", color: "#FFDA18" },
      ],
      hardware: [],
    },
  ];

  const vCenterVMs = [
    "My website",
    "WireGuard VPN",
    "Development Win10",
    "GitHub Workers",
    "WIN11-CANARY",
    "vCenter Old",
  ];

  const currentVM = virtualMachines.find((vm) => vm.id === selectedVM);

  const handleVMAction = (action: "power" | "settings") => {
    console.log(`${action} action for VM: ${selectedVM}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className="w-full h-screen relative overflow-hidden"
      style={{
        background: "#1F1F1F",
        backgroundImage:
          'url("https://api.builder.io/api/v1/image/assets/TEMP/32df3456c4cc74d73958ae26d58c6b5008a46202?width=4252")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Blur Layer */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />

      {/* Main Window Container */}
      <motion.div
        className="absolute inset-4 rounded-xl overflow-hidden"
        style={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), rgba(4, 4, 4, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "6px 6px 24px 5px rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(100px)",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top Toolbar */}
        <div
          className="flex items-center gap-4 px-4 py-3 h-12"
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* VMware Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-3 h-3 rounded-sm border-2"
                style={{ borderColor: "#4EB4FF" }}
              />
              <div
                className="absolute -left-1 top-0.5 w-3 h-3 rounded-sm border-2"
                style={{ borderColor: "#F38B00" }}
              />
            </div>

            {/* Menu Items */}
            <div className="flex items-center gap-4 text-sm">
              {["File", "Edit", "View", "VM", "Tabs", "About"].map((item) => (
                <span
                  key={item}
                  className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Toolbar Separator */}
          <div className="w-px h-4 bg-white/30" />

          {/* Control Icons */}
          <div className="flex items-center gap-4">
            {/* VM Control Icons */}
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 17 17" fill="none">
                <path
                  d="M4.49902 2V15M12.3105 2V15"
                  stroke="#F38F32"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path
                  d="M1.6317 4.46975C1.77235 4.32915 1.96308 4.25016 2.16195 4.25016C2.36082 4.25016 2.55155 4.32915 2.6922 4.46975L6.4047 8.18225L10.1172 4.46975C10.2587 4.33313 10.4481 4.25754 10.6448 4.25924C10.8414 4.26095 11.0295 4.33983 11.1686 4.47889C11.3076 4.61794 11.3865 4.80605 11.3882 5.0027C11.3899 5.19935 11.3143 5.3888 11.1777 5.53025L6.93495 9.773C6.7943 9.9136 6.60357 9.99259 6.4047 9.99259C6.20583 9.99259 6.0151 9.9136 5.87445 9.773L1.6317 5.53025C1.4911 5.3896 1.41211 5.19887 1.41211 5C1.41211 4.80113 1.4911 4.6104 1.6317 4.46975Z"
                  fill="#B5B5B5"
                />
              </svg>
            </div>

            <div className="w-px h-4 bg-white/30" />

            {/* Additional Controls */}
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 18 19" fill="none">
                <path
                  d="M4.4002 7.03991V6.53592V2.8C4.4002 2.35817 4.75837 2 5.2002 2H13.2002C13.642 2 14.0002 2.35817 14.0002 2.8V7.03991M4.4002 7.03991H2.0002C1.55837 7.03991 1.2002 7.39808 1.2002 7.83991V11.2798C1.2002 11.7217 1.55837 12.0798 2.0002 12.0798H10.8002M4.4002 7.03991H10.8002M14.0002 7.03991H16.4002C16.842 7.03991 17.2002 7.39808 17.2002 7.83991V11.2798C17.2002 11.7217 16.842 12.0798 16.4002 12.0798H14.0002M14.0002 7.03991H10.8002M10.8002 7.03991V12.0798M10.8002 12.0798H14.0002M14.0002 12.0798V18M14.0002 18L11.6484 15.5439M14.0002 18L16.4484 15.5439"
                  stroke="white"
                  strokeOpacity="0.3"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="w-px h-4 bg-white/30" />

              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 9 9" fill="none">
                  <path
                    d="M4.76792 0.773735V4.13687M4.76792 7.5V4.13687M4.76792 4.13687H1.40479M4.76792 4.13687H8.13105"
                    stroke="#B5B5B5"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <svg width="16" height="16" viewBox="0 0 19 17" fill="none">
                <path
                  d="M10.4661 0.0032608C9.39658 -0.027283 8.33177 0.157009 7.3347 0.545234C6.33763 0.933459 5.42856 1.51773 4.66127 2.26347C3.89398 3.00922 3.28406 3.90129 2.86761 4.8869C2.45115 5.87251 2.23662 6.93164 2.2367 8.00163H0.645913C0.245994 8.00163 0.0504787 8.48153 0.334865 8.75703L2.81436 11.2454C2.9921 11.4231 3.2676 11.4231 3.44534 11.2454L5.92483 8.75703C6.20922 8.48153 6.00482 8.00163 5.61379 8.00163H4.01411C4.01411 4.53567 6.8402 1.73624 10.3239 1.78068C13.6299 1.82511 16.4116 4.60676 16.456 7.91275C16.5005 11.3876 13.701 14.2226 10.2351 14.2226C8.80424 14.2226 7.48007 13.7338 6.4314 12.9073C6.26118 12.7732 6.04761 12.7063 5.83131 12.7195C5.61502 12.7326 5.41108 12.8247 5.2583 12.9784C4.88505 13.3605 4.91171 13.9826 5.3294 14.3114C6.7293 15.4079 8.45686 16.0026 10.2351 16C14.723 16 18.3578 12.2941 18.2334 7.77056C18.1179 3.60252 14.6342 0.118793 10.4661 0.0032608Z"
                  fill="white"
                  fillOpacity="0.3"
                />
              </svg>

              <svg width="18" height="18" viewBox="0 0 19 19" fill="none">
                <path
                  d="M10.8721 1.54768V1.54866C11.1587 1.54372 11.4378 1.63843 11.6611 1.81819C11.8849 1.99835 12.0386 2.25128 12.0947 2.53304L12.3721 3.90413C12.5996 4.01668 12.82 4.14285 13.0322 4.28206L14.3555 3.83675L14.3564 3.83577C14.4825 3.7944 14.6144 3.77431 14.7471 3.77522C14.9619 3.77544 15.1734 3.83178 15.3594 3.93929C15.5449 4.04654 15.6983 4.20112 15.8057 4.38655L17.1328 6.6346C17.2845 6.88057 17.3443 7.17301 17.3018 7.45882C17.2644 7.70883 17.1506 7.93999 16.9775 8.1219L16.9004 8.1971L15.8545 9.11214V9.88362L16.8828 10.825C17.0964 11.0123 17.2383 11.2684 17.2842 11.5487C17.33 11.8291 17.2777 12.1175 17.1348 12.3631L17.1338 12.3621L15.8525 14.6121H15.8516C15.7442 14.7981 15.5902 14.9529 15.4043 15.0604C15.2183 15.1679 15.0068 15.2242 14.792 15.2244C14.6593 15.2253 14.5274 15.2053 14.4014 15.1639H14.4004L13.083 14.7166C12.8686 14.8556 12.6462 14.9815 12.417 15.0946L12.1396 16.4666C12.0836 16.7485 11.9299 17.0013 11.7061 17.1815C11.4827 17.3613 11.2036 17.4569 10.917 17.452V17.453H8.26172V17.452C7.9749 17.4571 7.69517 17.3614 7.47168 17.1815C7.24797 17.0012 7.0941 16.7484 7.03809 16.4666V16.4657L6.76074 15.0946C6.53295 14.9818 6.3121 14.8561 6.09961 14.7166L4.77832 15.1639H4.77734C4.65104 15.2054 4.51869 15.2254 4.38574 15.2244C4.17103 15.2242 3.96032 15.1678 3.77441 15.0604C3.58843 14.9529 3.43358 14.7982 3.32617 14.6121V14.6112L1.99902 12.3631V12.3621C1.8503 12.1145 1.79398 11.8222 1.83984 11.5369C1.88587 11.2512 2.03139 10.9911 2.25098 10.8026L3.2793 9.88753V9.11604L2.25 8.17464L2.17285 8.10139C2.002 7.92312 1.88872 7.69633 1.84863 7.451C1.80283 7.17062 1.85615 6.88309 1.99902 6.63753V6.63655L3.32715 4.38655C3.43453 4.201 3.5888 4.04658 3.77441 3.93929C3.95831 3.83306 4.16661 3.77665 4.37891 3.77522C4.47783 3.76849 4.57739 3.77369 4.6748 3.79085L4.78027 3.81429L6.07324 4.28206C6.28756 4.14318 6.50926 4.01615 6.73828 3.90315L7.01562 2.53304C7.0717 2.25132 7.22549 1.99836 7.44922 1.81819C7.67272 1.63827 7.95242 1.54357 8.23926 1.54866V1.54768H10.8721Z"
                  fill="#B5B5B5"
                  stroke="#B5B5B5"
                  strokeWidth="0.2"
                />
                <path
                  d="M8.88867 6.0918C9.5627 5.95776 10.2616 6.02607 10.8965 6.28906C11.5314 6.55208 12.0742 6.99789 12.4561 7.56934C12.8377 8.14051 13.0408 8.81211 13.041 9.49902L13.0391 9.6709C13.0232 10.0701 12.9375 10.4643 12.7861 10.835C12.6131 11.2587 12.3568 11.6432 12.0332 11.9668C11.7096 12.2904 11.3251 12.5467 10.9014 12.7197C10.4778 12.8926 10.0238 12.9781 9.56641 12.9736V12.9746C8.87915 12.9746 8.20718 12.7714 7.63574 12.3896C7.0643 12.0078 6.61849 11.465 6.35547 10.8301C6.09248 10.1952 6.02417 9.49629 6.1582 8.82227C6.29229 8.14818 6.62339 7.52896 7.10938 7.04297C7.59536 6.55698 8.21459 6.22588 8.88867 6.0918ZM9.56445 7.34961C9.28061 7.343 8.99793 7.39441 8.73438 7.5C8.47084 7.60559 8.23102 7.76312 8.03027 7.96387C7.82952 8.16462 7.672 8.40443 7.56641 8.66797C7.46082 8.93153 7.4094 9.2142 7.41602 9.49805V9.50195C7.4094 9.7858 7.46082 10.0685 7.56641 10.332C7.672 10.5956 7.82952 10.8354 8.03027 11.0361C8.23102 11.2369 8.47084 11.3944 8.73438 11.5C8.99793 11.6056 9.28061 11.657 9.56445 11.6504H9.56836C9.85221 11.657 10.1349 11.6056 10.3984 11.5C10.662 11.3944 10.9018 11.2369 11.1025 11.0361C11.3033 10.8354 11.4608 10.5956 11.5664 10.332C11.672 10.0685 11.7234 9.7858 11.7168 9.50195V9.49805C11.7234 9.2142 11.672 8.93153 11.5664 8.66797C11.4608 8.40443 11.3033 8.16462 11.1025 7.96387C10.9018 7.76312 10.662 7.60559 10.3984 7.5C10.1349 7.39441 9.85221 7.343 9.56836 7.34961H9.56445Z"
                  fill="#B5B5B5"
                  stroke="#B5B5B5"
                  strokeWidth="0.2"
                />
              </svg>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex-1 flex justify-end items-center gap-6">
            {/* Window Controls */}
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 19 19" fill="none">
                <path
                  d="M15.5664 1.7002C16.5605 1.7002 17.3662 2.50589 17.3662 3.5V15.5C17.3662 16.4941 16.5605 17.2998 15.5664 17.2998H3.56641C2.57229 17.2998 1.7666 16.4941 1.7666 15.5V3.5C1.7666 2.50589 2.57229 1.7002 3.56641 1.7002H15.5664Z"
                  stroke="#4EB4FF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.39404 2.5V16.5"
                  stroke="#4EB4FF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <svg
                width="14"
                height="14"
                viewBox="0 0 19 19"
                fill="none"
                style={{ transform: "rotate(-90deg)" }}
              >
                <path
                  d="M1.7666 3.5C1.7666 2.50589 2.57229 1.7002 3.56641 1.7002H15.5664C16.5605 1.7002 17.3662 2.50589 17.3662 3.5V15.5C17.3662 16.4941 16.5605 17.2998 15.5664 17.2998H3.56641C2.57229 17.2998 1.7666 16.4941 1.7666 15.5L1.7666 3.5Z"
                  stroke="#B5B5B5"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.56641 11.6724H16.5664"
                  stroke="#B5B5B5"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <svg width="16" height="16" viewBox="0 0 19 19" fill="none">
                <path
                  d="M6.33105 5.26471H12.8016C13.3539 5.26471 13.8016 5.71243 13.8016 6.26471V12.7353C13.8016 13.2876 13.3539 13.7353 12.8016 13.7353H6.33105C5.77877 13.7353 5.33105 13.2876 5.33105 12.7353V6.26471C5.33105 5.71242 5.77877 5.26471 6.33105 5.26471Z"
                  stroke="#B5B5B5"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* VM Tabs */}
        <div className="flex items-center h-9 px-2 gap-1 bg-black/20 border-b border-white/10">
          {openedVMs.map((vmId) => {
            const vm = virtualMachines.find((v) => v.id === vmId);
            return (
              <motion.div
                key={vmId}
                className={`px-3 py-1.5 rounded-t-lg text-xs font-medium cursor-pointer transition-all ${
                  selectedVM === vmId
                    ? "bg-white/8 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setSelectedVM(vmId)}
              >
                {vm?.name}
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-80 h-full flex flex-col p-3 gap-4 border-r border-white/10 bg-black/20">
            {/* My Computer Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-xs font-medium tracking-wide">
                  My computer
                </h3>
              </div>

              <div className="space-y-1 pl-4">
                {virtualMachines.map((vm) => (
                  <motion.div
                    key={vm.id}
                    className={`px-2 py-1.5 rounded cursor-pointer transition-all ${
                      selectedVM === vm.id
                        ? "bg-white/15 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setSelectedVM(vm.id)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-xs font-normal tracking-wide">
                      {vm.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* vCenter Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-xs font-medium tracking-wide">
                  vCenter - 192.168.1.5
                </h3>
              </div>

              <div className="space-y-1 pl-4">
                {vCenterVMs.map((vmName, index) => (
                  <div
                    key={index}
                    className="px-2 py-1.5 rounded cursor-pointer text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <span className="text-xs font-normal tracking-wide">
                      {vmName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex">
            {/* VM Details Panel */}
            <div className="w-112 p-10 space-y-6 bg-white/8 overflow-y-auto">
              {currentVM && (
                <>
                  {/* VM Info Header */}
                  <div className="flex items-center gap-3">
                    <h1 className="text-white text-2xl font-semibold">
                      {currentVM.name}
                    </h1>
                    <span className="text-white/40 text-xs">
                      {currentVM.powerStatus}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg border-2 font-medium text-sm transition-all ${
                        currentVM.status === "running"
                          ? "bg-white text-black border-white"
                          : "border-white/60 text-white hover:border-white"
                      }`}
                      onClick={() => handleVMAction("power")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-4 h-4 bg-white rounded-sm" />
                      {currentVM.status === "running"
                        ? "Power off"
                        : "Power on"}
                    </motion.button>

                    <motion.button
                      className="flex-1 py-4 px-6 rounded-lg border-2 border-white/60 text-white font-medium text-sm hover:border-white transition-all"
                      onClick={() => handleVMAction("settings")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Edit VM settings
                    </motion.button>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-3">
                    <h2 className="text-white text-lg font-semibold">
                      Performance Metrics
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <div className="text-white text-sm mb-2">CPU</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/40 rounded">
                            <div
                              className="h-full bg-white/80 rounded transition-all duration-300"
                              style={{ width: `${currentVM.cpu.usage}%` }}
                            />
                          </div>
                          <span className="text-gray-300 text-xs font-semibold">
                            {currentVM.cpu.usage}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-white text-sm mb-2">Memory</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/40 rounded">
                            <div
                              className="h-full bg-white/80 rounded transition-all duration-300"
                              style={{ width: `${currentVM.memoryUsage}%` }}
                            />
                          </div>
                          <span className="text-gray-300 text-xs font-semibold">
                            {currentVM.memoryUsage}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-white text-sm mb-2">Disk</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/40 rounded">
                            <div
                              className="h-full bg-white/80 rounded transition-all duration-300"
                              style={{ width: `${currentVM.disk.usage}%` }}
                            />
                          </div>
                          <span className="text-gray-300 text-xs font-semibold">
                            {currentVM.disk.usage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VM Hardware */}
                  <div className="space-y-3">
                    <h2 className="text-white text-lg font-semibold">
                      VM hardware
                    </h2>

                    <div className="space-y-3">
                      {currentVM.hardware.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <span className="text-white text-sm">
                              {item.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-300 text-sm">
                              {item.value}
                            </div>
                            {item.details && (
                              <div className="text-gray-300 text-xs">
                                {item.details}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <h2 className="text-white text-lg font-semibold">Notes</h2>
                    <p className="text-white/50 text-sm">{currentVM.notes}</p>
                  </div>

                  {/* IP Addresses */}
                  <div className="space-y-2">
                    <h2 className="text-white text-lg font-semibold">
                      IP addresses
                    </h2>
                    <div className="text-white/50 text-sm">
                      {currentVM.ipAddresses.length > 0
                        ? currentVM.ipAddresses.join("\n")
                        : "No IP addresses"}
                    </div>
                  </div>

                  {/* DNS Name */}
                  <div className="space-y-2">
                    <h2 className="text-white text-lg font-semibold">
                      DNS Name
                    </h2>
                    <p className="text-white/50 text-sm">{currentVM.dnsName}</p>
                  </div>

                  {/* VM Configuration */}
                  <div className="space-y-3">
                    <h2 className="text-white text-lg font-semibold">
                      VM Configuration
                    </h2>
                    <div className="space-y-2">
                      <p className="text-white/50 text-sm">
                        Hardware compatibility: {currentVM.compatibility}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-white/50 text-sm">
                          {currentVM.path}
                        </p>
                        <button
                          onClick={() => copyToClipboard(currentVM.path)}
                          className="text-white/50 hover:text-white transition-colors"
                        >
                          <svg
                            width="12"
                            height="13"
                            viewBox="0 0 12 13"
                            fill="none"
                          >
                            <path
                              d="M7 4.5H2C1.4485 4.5 1 4.9485 1 5.5V10.5C1 11.0515 1.4485 11.5 2 11.5H7C7.5515 11.5 8 11.0515 8 10.5V5.5C8 4.9485 7.5515 4.5 7 4.5Z"
                              fill="currentColor"
                              fillOpacity="0.5"
                            />
                            <path
                              d="M10 1.5H5C4.73478 1.5 4.48043 1.60536 4.29289 1.79289C4.10536 1.98043 4 2.23478 4 2.5V3.5H8C8.26522 3.5 8.51957 3.60536 8.70711 3.79289C8.89464 3.98043 9 4.23478 9 4.5V8.5H10C10.2652 8.5 10.5196 8.39464 10.7071 8.20711C10.8946 8.01957 11 7.76522 11 7.5V2.5C11 2.23478 10.8946 1.98043 10.7071 1.79289C10.5196 1.60536 10.2652 1.5 10 1.5Z"
                              fill="currentColor"
                              fillOpacity="0.5"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <h2 className="text-white text-lg font-semibold">Tags</h2>
                    <div className="flex items-center gap-1 flex-wrap">
                      {currentVM.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded text-white text-xs font-medium"
                          style={{
                            background: `linear-gradient(0deg, rgba(255, 106, 73, 0.20) 0%, rgba(255, 106, 73, 0.20) 100%), ${tag.color}40`,
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Main VM Display Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <motion.div
                className="w-full max-w-4xl h-96 rounded-lg bg-black/70 flex items-center justify-center relative overflow-hidden"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at center, #0EA5E9 0%, #000000 100%)",
                  aspectRatio: "4/3",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {currentVM?.status === "running" ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
                        <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-white text-lg font-medium mb-1">
                        Getting ready
                      </div>
                      <div className="flex items-center gap-1 justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150" />
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-300" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-white/60 text-lg mb-2">
                      Virtual Machine is powered off
                    </div>
                    <div className="text-white/40 text-sm">
                      Click "Power on" to start the virtual machine
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VMwareInterface;
