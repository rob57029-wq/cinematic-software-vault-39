import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import SoftwareCard, { SoftwareItem } from "@/components/SoftwareCard";
import SoftwareModal from "@/components/SoftwareModal";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useConfig } from "@/contexts/ConfigContext";

// Game cheats and mod data for 2025
const gameData: SoftwareItem[] = [
  {
    id: "gta5-kiddions",
    name: "GTA 5 Kiddions Mod Menu",
    icon: "https://i.imgur.com/Q9K8Zg3.png",
    version: "v1.58",
    releaseDate: "August 2025",
    rating: 5,
    description: "Advanced external mod menu for GTA 5 with money drops, vehicle spawning, and player protection features.",
    installSteps: [
      "Download and extract the archive using the provided password.",
      "Run GTA 5 first and wait for it to fully load.",
      "Run Kiddions as administrator.",
      "Press F5 in-game to open the menu."
    ],
    features: [
      "Money drops and RP boost",
      "Vehicle spawning and customization",
      "Player protection and god mode",
      "Teleportation features",
      "Weather and time control",
      "Safe from ban detection"
    ],
    systemRequirements: [
      "Windows 10/11 64-bit",
      "GTA 5 installed (Steam/Epic/Rockstar)",
      "4GB RAM minimum",
      "Visual C++ Redistributable 2019",
      "Internet connection for updates"
    ]
  },
  {
    id: "krnl-executor",
    name: "KRNL Executor",
    icon: "https://i.imgur.com/X7vBn2M.png",
    version: "v3.2.1",
    releaseDate: "August 2025",
    rating: 4,
    description: "Powerful Roblox script executor with Level 8 execution and advanced features for script running.",
    installSteps: [
      "Download the KRNL package and extract with password.",
      "Disable Windows Defender temporarily.",
      "Run KRNL.exe as administrator.",
      "Wait for injection and enjoy scripting."
    ],
    features: [
      "Level 8 script execution",
      "Advanced script hub integration",
      "Auto-inject functionality",
      "Custom DLL support",
      "Built-in script library",
      "Regular updates and support"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Roblox installed",
      "4GB RAM minimum",
      ".NET Framework 4.7.2",
      "Antivirus disabled during use"
    ]
  },
  {
    id: "among-us-mod",
    name: "Among Us Mod Menu",
    icon: "https://i.imgur.com/L5Y9Rf8.png",
    version: "v2025.8.1",
    releaseDate: "August 2025",
    rating: 4,
    description: "Comprehensive mod menu for Among Us with impostor abilities, wallhacks, and game customization.",
    installSteps: [
      "Extract the mod files using the password.",
      "Launch Among Us normally first.",
      "Inject the mod using the provided injector.",
      "Press INSERT to toggle the menu in-game."
    ],
    features: [
      "Always impostor mode",
      "Wallhack and ESP features",
      "Speed hack and no clip",
      "Kill cooldown bypass",
      "Emergency meeting spam",
      "Custom cosmetics unlock"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Among Us (Steam version)",
      "2GB RAM minimum",
      "DirectX 11 compatible GPU",
      "Administrative privileges"
    ]
  },
  {
    id: "forza-horizon-5-mod",
    name: "Mod Menu Forza Horizon 5",
    icon: "https://i.imgur.com/P8Wk4mL.png",
    version: "v4.3",
    releaseDate: "August 2025",
    rating: 5,
    description: "Advanced mod menu for Forza Horizon 5 with credit generation, car unlocks, and physics modifications.",
    installSteps: [
      "Download and extract with the provided password.",
      "Launch Forza Horizon 5 and wait for main menu.",
      "Run the mod injector as administrator.",
      "Use F1 to open/close the mod menu."
    ],
    features: [
      "Unlimited credits generator",
      "All cars unlock instantly",
      "Physics modifications",
      "Speed and handling tweaks",
      "Teleportation system",
      "Anti-ban protection"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Forza Horizon 5 (Steam/Microsoft Store)",
      "8GB RAM minimum",
      "DirectX 12 compatible GPU",
      "Latest Visual C++ packages"
    ]
  },
  {
    id: "minecraft-hack-client",
    name: "Minecraft Hack Client",
    icon: "https://i.imgur.com/9vKm3x2.png",
    version: "Impact 4.11",
    releaseDate: "August 2025",
    rating: 5,
    description: "Professional Minecraft client with X-Ray, fly, speed hack, and comprehensive PvP enhancements.",
    installSteps: [
      "Extract the client files with the password.",
      "Run the installer and select your Minecraft version.",
      "Launch Minecraft and select Impact profile.",
      "Press RIGHT SHIFT to open the mod menu."
    ],
    features: [
      "X-Ray for ore detection",
      "Fly and speed modifications",
      "Auto-mine and auto-build",
      "PvP enhancements and killAura",
      "ESP and wallhack features",
      "Compatible with most servers"
    ],
    systemRequirements: [
      "Windows 10/11 or macOS 11+",
      "Minecraft Java Edition",
      "4GB RAM minimum",
      "Java 17 or newer",
      "Internet connection for updates"
    ]
  },
  {
    id: "ea-fc-25-editor",
    name: "EA FC 25 Live Editor",
    icon: "https://i.imgur.com/T4bK6xE.png",
    version: "v25.1.2",
    releaseDate: "August 2025",
    rating: 4,
    description: "Real-time editor for EA FC 25 with player stats modification, team editing, and career mode enhancements.",
    installSteps: [
      "Download and extract using the provided password.",
      "Close EA FC 25 completely if running.",
      "Run the Live Editor as administrator.",
      "Launch EA FC 25 and start your career mode."
    ],
    features: [
      "Real-time player stat editing",
      "Team formation modifications",
      "Transfer budget increases",
      "Youth academy enhancements",
      "Contract negotiations bypass",
      "Achievement unlocker"
    ],
    systemRequirements: [
      "Windows 10/11 64-bit",
      "EA FC 25 installed",
      "8GB RAM minimum",
      "Administrative privileges",
      "Latest .NET Framework"
    ]
  },
  {
    id: "cod-bo6-unlock",
    name: "COD BO6 Unlock Tool",
    icon: "https://i.imgur.com/H9Y2mP5.png",
    version: "v1.7",
    releaseDate: "August 2025",
    rating: 5,
    description: "Complete unlock tool for Call of Duty Black Ops 6 with all weapons, camos, and operator skins.",
    installSteps: [
      "Extract the unlock tool with the password.",
      "Launch Call of Duty Black Ops 6.",
      "Run the unlock tool as administrator.",
      "Click 'Unlock All' and restart the game."
    ],
    features: [
      "All weapons and attachments unlock",
      "Complete camo collection",
      "Operator skins and bundles",
      "Max level progression",
      "Prestige tokens generation",
      "Safe unlock method"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Call of Duty Black Ops 6",
      "8GB RAM minimum",
      "Battle.net or Steam client",
      "Administrative access"
    ]
  },
  {
    id: "roblox-mm2-script",
    name: "Roblox MM2 Script",
    icon: "https://i.imgur.com/V3L8nK9.png",
    version: "v2.8.5",
    releaseDate: "August 2025",
    rating: 4,
    description: "Advanced Murder Mystery 2 script with ESP, aimbot, auto-collect coins, and role manipulation.",
    installSteps: [
      "Download the script package and extract.",
      "Launch Roblox and join Murder Mystery 2.",
      "Execute the script using your preferred executor.",
      "Use the GUI to enable desired features."
    ],
    features: [
      "Player ESP and wallhack",
      "Aimbot for sheriff/murderer",
      "Auto-collect coins and items",
      "Role switcher functionality",
      "Speed and jump hacks",
      "Anti-kick protection"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Roblox installed",
      "Script executor (KRNL, Synapse, etc.)",
      "4GB RAM minimum",
      "Stable internet connection"
    ]
  },
  {
    id: "8ball-pool-mod",
    name: "8 Ball Pool Mod Menu",
    icon: "https://i.imgur.com/Q2F7bE3.png",
    version: "v5.2.7",
    releaseDate: "August 2025",
    rating: 4,
    description: "Comprehensive mod for 8 Ball Pool with aimbot, extended guidelines, and coin generation.",
    installSteps: [
      "Download the APK mod file and extract.",
      "Uninstall the original 8 Ball Pool app.",
      "Install the modded APK (enable unknown sources).",
      "Launch and enjoy unlimited features."
    ],
    features: [
      "Advanced aimbot system",
      "Extended guideline hack",
      "Unlimited coins and cash",
      "All cues unlocked",
      "Auto-win functionality",
      "Anti-ban protection"
    ],
    systemRequirements: [
      "Android 7.0+ or Windows with emulator",
      "2GB RAM minimum",
      "50MB free storage",
      "Internet connection",
      "Unknown sources enabled (Android)"
    ]
  },
  {
    id: "cs2-skin-changer",
    name: "CS2 Skin Changer",
    icon: "https://i.imgur.com/M6K8Hf2.png",
    version: "v3.1.8",
    releaseDate: "August 2025",
    rating: 5,
    description: "Advanced skin changer for Counter-Strike 2 with all skins, knives, and gloves available locally.",
    installSteps: [
      "Extract the skin changer files with password.",
      "Close Steam and CS2 completely.",
      "Run the skin changer as administrator.",
      "Launch CS2 and enjoy custom skins."
    ],
    features: [
      "All weapon skins available",
      "Knife and glove collection",
      "StatTrak and sticker support",
      "Real-time skin switching",
      "Config save/load system",
      "VAC-safe implementation"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Counter-Strike 2 installed",
      "Steam client",
      "4GB RAM minimum",
      "Administrative privileges"
    ]
  },
  {
    id: "rdr2-mod-menu",
    name: "RDR 2 Mod Menu",
    icon: "https://i.imgur.com/K7N4mX8.png",
    version: "v1.9.3",
    releaseDate: "August 2025",
    rating: 5,
    description: "Comprehensive Red Dead Redemption 2 mod menu with money drops, spawning, and world modifications.",
    installSteps: [
      "Download and extract the mod files.",
      "Launch Red Dead Redemption 2 first.",
      "Inject the mod using the provided injector.",
      "Press F4 to open the mod menu in-game."
    ],
    features: [
      "Money and gold generation",
      "Vehicle and animal spawning",
      "Weather and time control",
      "Player modifications",
      "Teleportation system",
      "Online session protections"
    ],
    systemRequirements: [
      "Windows 10/11 64-bit",
      "Red Dead Redemption 2",
      "8GB RAM minimum",
      "Visual C++ 2019 Redistributable",
      "Administrative access"
    ]
  },
  {
    id: "roblox-garden-script",
    name: "Roblox Grow a Garden Script",
    icon: "https://i.imgur.com/N8V5mL2.png",
    version: "v1.4.2",
    releaseDate: "August 2025",
    rating: 4,
    description: "Automated farming script for Grow a Garden with auto-plant, harvest, and money generation.",
    installSteps: [
      "Download the script and extract files.",
      "Join Grow a Garden in Roblox.",
      "Execute the script in your preferred executor.",
      "Configure auto-farming settings in GUI."
    ],
    features: [
      "Auto-plant and harvest crops",
      "Money generation automation",
      "Plot expansion assistance",
      "Seed purchasing automation",
      "Anti-AFK protection",
      "Speed farming options"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Roblox installed",
      "Script executor required",
      "2GB RAM minimum",
      "Stable internet connection"
    ]
  }
];

// Additional remaining game data for all 80+ cheats/mods
const remainingGameData: SoftwareItem[] = [
  {
    id: "roblox-blade-ball-script",
    name: "Roblox Blade Ball Script",
    icon: "https://i.imgur.com/B7X3mK9.png",
    version: "v2.4.8",
    releaseDate: "August 2025",
    rating: 5,
    description: "Ultimate Blade Ball script with auto-parry, speed boost, and advanced player enhancements.",
    installSteps: [
      "Download and extract script files.",
      "Launch Roblox and join Blade Ball.",
      "Execute the script using your executor.",
      "Configure auto-parry settings."
    ],
    features: [
      "Perfect auto-parry system",
      "Speed and jump boosts",
      "Ball prediction algorithm",
      "Anti-kick protection",
      "Statistics display",
      "Customizable settings"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Roblox + Executor",
      "3GB RAM minimum",
      "Stable internet",
      "Blade Ball game access"
    ]
  },
  {
    id: "roblox-dead-rails-script",
    name: "Roblox Dead Rails Script",
    icon: "https://i.imgur.com/D8R4nL3.png",
    version: "v1.7.2",
    releaseDate: "August 2025",
    rating: 4,
    description: "Comprehensive Dead Rails automation script with auto-farm, ESP, and combat enhancements.",
    installSteps: [
      "Extract script package with password.",
      "Join Dead Rails in Roblox.",
      "Execute using your preferred executor.",
      "Enable desired automation features."
    ],
    features: [
      "Auto-farming system",
      "Player and zombie ESP",
      "Auto-combat features",
      "Resource collection automation",
      "Anti-detection measures",
      "Customizable GUI"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Roblox + Script Executor",
      "3GB RAM minimum",
      "Internet connection",
      "Dead Rails game access"
    ]
  },
  {
    id: "roblox-arise-crossover-script",
    name: "Roblox Arise Crossover Script",
    icon: "https://i.imgur.com/A9C5xT7.png",
    version: "v2.1.5",
    releaseDate: "August 2025",
    rating: 4,
    description: "Advanced Arise Crossover script with auto-quest, skill farming, and progression automation.",
    installSteps: [
      "Download script files and extract.",
      "Launch Roblox Arise Crossover.",
      "Execute script in your executor.",
      "Configure auto-quest settings."
    ],
    features: [
      "Auto-quest completion",
      "Skill farming automation",
      "Level progression boost",
      "Item collection system",
      "Anti-ban protection",
      "Real-time statistics"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Roblox + Executor",
      "4GB RAM minimum",
      "Stable internet",
      "Arise Crossover access"
    ]
  },
  {
    id: "roblox-swift-executor",
    name: "Roblox Swift Executor",
    icon: "https://i.imgur.com/S6W8mK2.png",
    version: "v4.1.3",
    releaseDate: "August 2025",
    rating: 5,
    description: "Ultra-fast Roblox executor with premium features and advanced script support.",
    installSteps: [
      "Extract Swift Executor files.",
      "Disable Windows Defender temporarily.",
      "Run Swift as administrator.",
      "Inject and execute your scripts."
    ],
    features: [
      "Lightning-fast injection",
      "Level 8+ script execution",
      "Premium script library",
      "Advanced anti-detection",
      "Custom UI themes",
      "Auto-update system"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Roblox installed",
      "4GB RAM minimum",
      ".NET Framework 4.8",
      "Administrative privileges"
    ]
  },
  {
    id: "roblox-jailbreak-script",
    name: "Roblox Jailbreak Script",
    icon: "https://i.imgur.com/J7B9mN4.png",
    version: "v3.8.1",
    releaseDate: "August 2025",
    rating: 5,
    description: "Ultimate Jailbreak script with auto-rob, ESP, teleportation, and money farming features.",
    installSteps: [
      "Download Jailbreak script package.",
      "Join Jailbreak in Roblox.",
      "Execute script using your executor.",
      "Enable auto-rob and other features."
    ],
    features: [
      "Auto-rob all locations",
      "Player and vehicle ESP",
      "Teleportation system",
      "Money farming automation",
      "Police bypass features",
      "Anti-arrest protection"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Roblox + Script Executor",
      "3GB RAM minimum",
      "Internet connection",
      "Jailbreak game access"
    ]
  },
  {
    id: "roblox-volcano-executor",
    name: "Roblox Volcano Executor",
    icon: "https://i.imgur.com/V8L7mP6.png",
    version: "v2.9.4",
    releaseDate: "August 2025",
    rating: 4,
    description: "Powerful Roblox executor with advanced features and comprehensive script support.",
    installSteps: [
      "Extract Volcano Executor files.",
      "Run as administrator.",
      "Inject into Roblox process.",
      "Load and execute your scripts."
    ],
    features: [
      "Level 7 script execution",
      "Built-in script hub",
      "Custom DLL injection",
      "Anti-crash protection",
      "Multi-instance support",
      "Regular updates"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Roblox installed",
      "4GB RAM minimum",
      "Visual C++ Redistributable",
      "Administrative access"
    ]
  },
  {
    id: "lol-skin-changer",
    name: "LoL Skin Changer",
    icon: "https://i.imgur.com/L9S5kR8.png",
    version: "v14.17.2",
    releaseDate: "August 2025",
    rating: 4,
    description: "Advanced League of Legends skin changer with all skins, chromas, and ward skins available.",
    installSteps: [
      "Extract skin changer files with password.",
      "Close League of Legends completely.",
      "Run skin changer as administrator.",
      "Launch LoL and select desired skins."
    ],
    features: [
      "All champion skins unlocked",
      "Chroma variations available",
      "Ward and emote skins",
      "Real-time skin switching",
      "Config save/load system",
      "Riot-safe implementation"
    ],
    systemRequirements: [
      "Windows 10/11",
      "League of Legends installed",
      "Riot Games client",
      "4GB RAM minimum",
      "Administrative privileges"
    ]
  },
  {
    id: "valorant-skin-changer",
    name: "Valorant Skin Changer",
    icon: "https://i.imgur.com/V9K3mL7.png",
    version: "v8.11.1",
    releaseDate: "August 2025",
    rating: 5,
    description: "Complete Valorant skin changer with all weapon skins, buddies, and player cards.",
    installSteps: [
      "Download and extract with password.",
      "Close Valorant and Riot Client.",
      "Run skin changer as administrator.",
      "Launch Valorant and enjoy skins."
    ],
    features: [
      "All weapon skin collection",
      "Knife and melee skins",
      "Gun buddy customization",
      "Player card unlocks",
      "Spray and title access",
      "Vanguard-safe operation"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Valorant installed",
      "Riot Vanguard compatible",
      "6GB RAM minimum",
      "Administrative access"
    ]
  },
  {
    id: "albion-online-hack",
    name: "Albion Online Hack",
    icon: "https://i.imgur.com/A8B7mK4.png",
    version: "v28.3.1",
    releaseDate: "August 2025",
    rating: 4,
    description: "Comprehensive Albion Online hack with gathering bot, PvP enhancements, and economy tools.",
    installSteps: [
      "Extract hack files with password.",
      "Launch Albion Online first.",
      "Inject hack as administrator.",
      "Configure desired features."
    ],
    features: [
      "Auto-gathering bot system",
      "PvP combat enhancements",
      "Economy tracking tools",
      "Dungeon farming automation",
      "Player tracking radar",
      "Anti-detection measures"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Albion Online installed",
      "8GB RAM minimum",
      "Stable internet connection",
      "Administrative privileges"
    ]
  },
  {
    id: "rainbow-six-siege-cheats",
    name: "Rainbow Six Siege Cheats",
    icon: "https://i.imgur.com/R6S9mN2.png",
    version: "v9.4.2",
    releaseDate: "August 2025",
    rating: 5,
    description: "Advanced R6S cheat with wallhack, aimbot, recoil control, and BattlEye bypass.",
    installSteps: [
      "Extract cheat package with password.",
      "Disable all antivirus software.",
      "Run loader as administrator.",
      "Inject after game launch."
    ],
    features: [
      "Player wallhack and ESP",
      "Advanced aimbot system",
      "Recoil control macro",
      "Gadget ESP display",
      "No spread/no recoil",
      "BattlEye bypass technology"
    ],
    systemRequirements: [
      "Windows 10/11",
      "Rainbow Six Siege",
      "8GB RAM minimum",
      "Uplay/Steam client",
      "Administrative access"
    ]
  }
];

// Complete game data array with all cheats and mods
const allGameData = [...gameData, ...remainingGameData];

const Games = () => {
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSoftware, setFilteredSoftware] = useState<SoftwareItem[]>(allGameData);
  const { t } = useLanguage();
  const { config } = useConfig();
  const softwareGridRef = useRef<HTMLDivElement>(null);

  // Filter software based on search term
  useEffect(() => {
    const filtered = allGameData.filter(software =>
      software.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      software.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSoftware(filtered);
  }, [searchTerm]);

  const handleSoftwareClick = (software: SoftwareItem) => {
    setSelectedSoftware(software);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSoftware(null);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 container mx-auto text-center relative z-10">
          <div className="reveal">
            <h1 className="text-4xl md:text-6xl font-light mb-6">
              Game <span className="gradient-text">Cheats & Mods</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto">
              Discover the latest game cheats, mod menus, and hacks for 2025. Enhance your gaming experience with our premium collection.
            </p>
          </div>
        </section>

        {/* Games Catalog Section */}
        <section id="games" ref={softwareGridRef} className="py-16 px-4 container mx-auto relative z-10">
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between reveal">
            <div>
              <h2 className="text-2xl md:text-3xl font-light mb-2">Game Cheats Catalog</h2>
              <p className="text-white/60">Browse our collection of <span className="gradient-text">premium game modifications</span></p>
            </div>
            <div className="mt-4 md:mt-0 max-w-md w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search game cheats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-glass-gradient backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="software-grid reveal">
            {filteredSoftware.map((software) => (
              <div key={software.id}>
                <SoftwareCard 
                  software={software} 
                  onClick={() => handleSoftwareClick(software)}
                  className="card-hover"
                />
              </div>
            ))}
          </div>

          {filteredSoftware.length === 0 && (
            <div className="text-center py-12 reveal">
              <p className="text-white/60 text-lg">No game cheats found matching your search.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <SoftwareModal
        software={selectedSoftware}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Games;