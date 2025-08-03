
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import SoftwareCard, { SoftwareItem } from "@/components/SoftwareCard";
import SoftwareModal from "@/components/SoftwareModal";
import { ReviewItem } from "@/components/ReviewCard";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import InstallStep from "@/components/InstallStep";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useConfig } from "@/contexts/ConfigContext";
import { subDays } from "date-fns";

// Software data
const softwareData: SoftwareItem[] = [
  {
    id: "photoshop-2025",
    name: "Adobe Photoshop 2025",
    icon: "https://i.imgur.com/9Pkr85Q.png",
    version: "v25.0",
    releaseDate: "May 2025",
    rating: 5,
    description: "Professional image editing software with advanced AI capabilities for designers, photographers, and artists.",
    installSteps: [
      "Download the file and extract the archive using the password provided.",
      "Run the Setup.exe file and follow the installation wizard.",
      "When prompted, choose 'Try' instead of 'Sign In'.",
      "After installation completes, run the included patch to activate."
    ],
    features: [
      "Advanced AI-powered image manipulation",
      "Smart object support with improved handling",
      "Enhanced neural filters for portraits",
      "Generative fill and expand capabilities",
      "Cloud document collaboration",
      "3D design elements integration"
    ],
    systemRequirements: [
      "Windows 10/11 (64-bit) or macOS 12+",
      "16GB RAM (32GB recommended)",
      "4GB GPU VRAM (8GB recommended)",
      "15GB available hard disk space",
      "1920×1080 display or higher"
    ]
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: "https://i.imgur.com/o4YJK0W.png",
    version: "Premium",
    releaseDate: "April 2025",
    rating: 4,
    description: "Stream music, create playlists, discover new music, and enjoy podcasts with premium features unlocked.",
    installSteps: [
      "Download and extract the installation files using the password.",
      "Run the SpotifySetup.exe and install the application.",
      "After installation, run the included patcher as administrator.",
      "Restart Spotify and enjoy premium features."
    ],
    features: [
      "Ad-free music streaming experience",
      "Download songs for offline listening",
      "High quality audio (320 kbps)",
      "Unlimited skips feature enabled",
      "Access to exclusive content",
      "Enhanced playlist management tools"
    ],
    systemRequirements: [
      "Windows 7 or higher / macOS 10.13 or higher",
      "4GB RAM minimum",
      "1GB available storage space",
      "Internet connection for streaming",
      "Audio output device"
    ]
  },
  {
    id: "idm",
    name: "Internet Download Manager",
    icon: "https://i.imgur.com/Y67gJG6.png",
    version: "6.42 Build 25",
    releaseDate: "March 2025",
    rating: 5,
    description: "Powerful download manager with resume and scheduling capabilities for all your internet downloads.",
    installSteps: [
      "Download and extract the archive with the provided password.",
      "Run the IDM installation file and complete the setup process.",
      "After installation, close IDM completely including from system tray.",
      "Run the included patch and select 'Patch' when prompted."
    ],
    features: [
      "Resume broken downloads functionality",
      "Schedule downloads for specific times",
      "Browser integration for one-click downloading",
      "Automatic virus checking after download",
      "Download categories organization",
      "Multiple simultaneous downloads"
    ],
    systemRequirements: [
      "Windows 7/8/10/11",
      "2GB RAM minimum",
      "50MB disk space",
      "Internet connection",
      "Supported browsers: Chrome, Firefox, Edge, etc."
    ]
  },
  {
    id: "fl-studio",
    name: "FL Studio",
    icon: "https://i.imgur.com/7VgEC3i.png",
    version: "21.2",
    releaseDate: "January 2025",
    rating: 5,
    description: "Complete music production environment with everything you need to compose, arrange, record, edit, mix and master.",
    installSteps: [
      "Extract the downloaded archive using the provided password.",
      "Run the installation file and follow the setup wizard.",
      "Choose your installation location and plugin preferences.",
      "After installation, run the included keygen to activate."
    ],
    features: [
      "Multi-track audio recording capabilities",
      "MIDI sequencing and piano roll editing",
      "Mixer with effects chain support",
      "VST and AU plugin compatibility",
      "Lifetime free updates with Signature Bundle",
      "Advanced automation features"
    ],
    systemRequirements: [
      "Windows 10/11 64-bit or macOS 10.15+",
      "8GB RAM minimum (16GB recommended)",
      "4GB free disk space",
      "Audio interface recommended",
      "ASIO-compatible sound card"
    ]
  },
  {
    id: "davinci-resolve",
    name: "DaVinci Resolve",
    icon: "https://i.imgur.com/QlXoTcp.png",
    version: "19.1 Studio",
    releaseDate: "February 2025",
    rating: 5,
    description: "Professional editing, color correction, visual effects, motion graphics, and audio post-production, all in one software.",
    installSteps: [
      "Extract the download with the provided password.",
      "Run the DaVinci Resolve Studio installer.",
      "Follow the installation wizard instructions.",
      "After installation, run the activation tool and follow the prompts."
    ],
    features: [
      "Professional video editing timeline",
      "Advanced color grading tools",
      "Fusion visual effects integration",
      "Fairlight audio post-production",
      "Multi-user collaboration features",
      "AI-powered Smart Rendering"
    ],
    systemRequirements: [
      "Windows 10/11 64-bit or macOS 12+",
      "32GB RAM minimum for 4K editing",
      "Dedicated GPU with 8GB+ VRAM",
      "Fast SSD storage (NVMe recommended)",
      "16GB+ available disk space"
    ]
  },
  {
    id: "trading-bot-3dcomm",
    name: "Trading Bot 3DComm",
    icon: "https://i.imgur.com/lZKGUcb.png",
    version: "3.7",
    releaseDate: "March 2025",
    rating: 4,
    description: "Automated trading software with AI analysis for cryptocurrency, forex, and stock markets.",
    installSteps: [
      "Extract the downloaded package using the password.",
      "Run setup.exe and accept the license agreement.",
      "Select installation options and complete the wizard.",
      "Run the included license activator as administrator."
    ],
    features: [
      "AI-powered market trend analysis",
      "Real-time trading signals across multiple markets",
      "Customizable trading strategies",
      "Risk management tools and stop-loss automation",
      "Historical backtesting capabilities",
      "Multi-exchange API integration"
    ],
    systemRequirements: [
      "Windows 10/11 64-bit (macOS coming soon)",
      "8GB RAM minimum (16GB recommended)",
      "Stable internet connection (5Mbps+)",
      "4GB available disk space",
      "Multi-core processor recommended"
    ]
  },
  {
    id: "adobe-substance-3d",
    name: "Adobe Substance 3D",
    icon: "https://i.imgur.com/hpMDOLR.png",
    version: "4.2",
    releaseDate: "December 2024",
    rating: 5,
    description: "Complete suite for 3D texturing, materials, and design with powerful tools for creating realistic textures.",
    installSteps: [
      "Download and extract using the provided password.",
      "Run the installer and select the components you want to install.",
      "Complete the Adobe installation process.",
      "Run the included patcher and follow instructions to activate."
    ],
    features: [
      "Procedural material creation tools",
      "Physically-based rendering pipeline",
      "3D asset library access",
      "AI-enhanced texture generation",
      "Direct integration with other Adobe products",
      "Export for popular 3D software and game engines"
    ],
    systemRequirements: [
      "Windows 10/11 64-bit or macOS 11+",
      "16GB RAM minimum (32GB recommended)",
      "GPU with 4GB VRAM minimum",
      "20GB available hard disk space",
      "OpenGL 4.1 capable system"
    ]
  },
  {
    id: "capcut-pro",
    name: "CapCut Pro",
    icon: "https://i.imgur.com/LXtrxQA.png",
    version: "2.5 Pro",
    releaseDate: "January 2025",
    rating: 4,
    description: "Professional video editing software optimized for social media content with advanced effects and transitions.",
    installSteps: [
      "Extract the downloaded file with the password.",
      "Run the CapCut installer and complete setup.",
      "Do not launch the application after installation.",
      "Run the provided activation tool as administrator."
    ],
    features: [
      "Professional video editing timeline",
      "AI-powered video enhancement tools",
      "Social media-optimized export presets",
      "Advanced keyframe animation controls",
      "Premium effect pack included",
      "Green screen and motion tracking"
    ],
    systemRequirements: [
      "Windows 10/11 or macOS 11+",
      "8GB RAM minimum (16GB recommended)",
      "Intel Core i5 or better processor",
      "2GB GPU VRAM minimum",
      "5GB available disk space"
    ]
  },
  // More software items shortened for brevity
  {
    id: "adobe-acrobat",
    name: "Adobe Acrobat",
    icon: "https://i.imgur.com/yU34XFx.png",
    version: "DC Pro 2025",
    releaseDate: "January 2025",
    rating: 4,
    description: "Professional PDF editor with advanced features for creating, editing, signing and managing PDF documents.",
    installSteps: ["Extract with password", "Run installer", "Choose installation options", "Run activator as admin"],
    features: ["PDF editing and creation", "Document signing", "Form creation", "OCR text recognition", "Cloud integration", "Password protection"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "4GB RAM", "4GB disk space", "1GHz processor", "1024x768 screen resolution"]
  },
  {
    id: "after-effects",
    name: "Adobe After Effects",
    icon: "https://i.imgur.com/GHvhx72.png",
    version: "2025",
    releaseDate: "March 2025",
    rating: 5,
    description: "Industry-standard motion graphics and visual effects software for film, TV, and video production.",
    installSteps: ["Extract files with password", "Run installer", "Follow setup wizard", "Apply patch after installation"],
    features: ["3D motion graphics", "Visual effects compositing", "Animation tools", "Expression controls", "Template creation", "AI-powered rotoscoping"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "16GB RAM minimum", "8GB GPU VRAM", "SSD storage recommended", "Multi-core processor"]
  },
  {
    id: "after-effects-ai",
    name: "Adobe After Effects AI",
    icon: "https://i.imgur.com/6gtWEGQ.png",
    version: "Alter 1.0",
    releaseDate: "April 2025",
    rating: 5,
    description: "Next-generation motion graphics with integrated AI for automated animations and effects generation.",
    installSteps: ["Extract with password", "Run installer", "Configure components", "Run activation tool"],
    features: ["AI-generated animations", "Automated rotoscoping", "Neural style transfers", "Voice-controlled editing", "Motion capture from video", "Real-time rendering"],
    systemRequirements: ["Windows 11 or macOS 12+", "32GB RAM", "NVIDIA RTX GPU", "20GB disk space", "Intel i7/AMD Ryzen 7 or better"]
  },
  {
    id: "proton-vpn",
    name: "Proton VPN",
    icon: "https://i.imgur.com/yP5bJ1I.png",
    version: "Premium 3.5",
    releaseDate: "December 2024",
    rating: 4,
    description: "Secure VPN service with premium features unlocked for safe and private internet browsing.",
    installSteps: ["Extract archive", "Run installer", "Complete setup", "Run license activator"],
    features: ["Unlimited bandwidth", "Secure Core servers", "NetShield ad blocker", "P2P/BitTorrent support", "10Gbps servers", "Kill switch feature"],
    systemRequirements: ["Windows 8/10/11 or macOS 10.14+", "2GB RAM", "100MB disk space", "Internet connection", "Any modern processor"]
  },
  {
    id: "wondershare",
    name: "Wondershare Filmora",
    icon: "https://i.imgur.com/ujFvlL3.png",
    version: "14 Pro",
    releaseDate: "February 2025",
    rating: 4,
    description: "Easy-to-use video editing software with professional features and effects for content creators.",
    installSteps: ["Extract files", "Run setup", "Choose installation options", "Apply crack after installation"],
    features: ["Intuitive timeline editing", "AI portrait tools", "Motion tracking", "Audio ducking", "Screen recording", "Speed ramping"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "8GB RAM", "Intel i5 or better", "2GB free disk space", "1280x768 screen resolution"]
  },
  {
    id: "premiere-pro",
    name: "Adobe Premiere Pro",
    icon: "https://i.imgur.com/h6YJfMO.png",
    version: "2025",
    releaseDate: "March 2025",
    rating: 5,
    description: "Professional video editing software for film, TV and web, with comprehensive tools for any production.",
    installSteps: ["Extract archive", "Run installer", "Complete setup", "Run patcher as admin"],
    features: ["Multi-camera editing", "Auto reframe tool", "Color grading", "AI audio enhancement", "4K+ resolution support", "Seamless Adobe integration"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "16GB RAM (32GB for 4K)", "6GB GPU VRAM", "8GB available disk space", "Monitor resolution 1920x1080"]
  },
  {
    id: "topaz-ai",
    name: "Topaz AI",
    icon: "https://i.imgur.com/7cwPw2B.png",
    version: "Photo Suite 2025",
    releaseDate: "January 2025",
    rating: 5,
    description: "AI-powered photo enhancement software suite for upscaling, noise reduction, and image quality improvement.",
    installSteps: ["Extract with password", "Run installer", "Select components", "Apply activation patch"],
    features: ["AI upscaling", "Noise reduction", "Sharpening AI", "JPEG artifact removal", "Batch processing", "Plugin support for editors"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "16GB RAM minimum", "NVIDIA/AMD GPU with 4GB+ VRAM", "10GB free disk space", "Intel i5/AMD Ryzen 5+"]
  }
];

// Remaining software items abbreviated
const remainingSoftware: SoftwareItem[] = [
  {
    id: "coreldraw",
    name: "CorelDRAW",
    icon: "https://i.imgur.com/FQBOcPY.png",
    version: "Graphics Suite 2025",
    releaseDate: "February 2025",
    rating: 4,
    description: "Professional vector illustration, layout and photo editing software.",
    installSteps: ["Extract files", "Run setup", "Follow instructions", "Apply keygen"],
    features: ["Vector illustration tools", "Page layout features", "Photo editing capabilities", "Typography tools", "Web graphics tools", "Collaboration features"],
    systemRequirements: ["Windows 10/11 64-bit or macOS 11+", "8GB RAM", "4GB disk space", "Multi-core processor", "1280x768 screen resolution"]
  },
  {
    id: "illustrator",
    name: "Adobe Illustrator",
    icon: "https://i.imgur.com/z8LpkCb.png",
    version: "2025",
    releaseDate: "March 2025",
    rating: 5,
    description: "Industry-standard vector graphics software for design and illustration.",
    installSteps: ["Extract archive", "Run installer", "Complete setup", "Run activation tool"],
    features: ["Vector graphics tools", "Precision drawing", "Type tools", "Pattern creation", "3D effects", "Responsive design features"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "8GB RAM", "2GB GPU VRAM", "3GB disk space", "Multi-core processor"]
  },
  {
    id: "lightroom",
    name: "Adobe Lightroom",
    icon: "https://i.imgur.com/3FUHHoJ.png",
    version: "Classic 14.0",
    releaseDate: "April 2025",
    rating: 5,
    description: "Professional photo editing and management software for photographers.",
    installSteps: ["Extract with password", "Install software", "Follow wizard", "Apply patch"],
    features: ["Non-destructive editing", "Advanced color grading", "AI masking tools", "Photo organization", "Preset system", "Tethered shooting"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "8GB RAM", "4GB disk space", "1024x768 screen resolution", "Intel or AMD processor"]
  },
  {
    id: "media-encoder",
    name: "Adobe Media Encoder",
    icon: "https://i.imgur.com/7hx69MZ.png",
    version: "2025",
    releaseDate: "March 2025",
    rating: 4,
    description: "Video encoding and compression software for optimal output formats.",
    installSteps: ["Extract files", "Run installer", "Follow instructions", "Apply activation"],
    features: ["Batch encoding", "Format presets", "Watch folder automation", "Adobe integration", "HDR encoding support", "Proxy workflow"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "16GB RAM", "4GB GPU VRAM", "2GB disk space", "Intel i7 or better"]
  },
  {
    id: "adobe-audition",
    name: "Adobe Audition",
    icon: "https://i.imgur.com/xLDcz8p.png",
    version: "2025",
    releaseDate: "March 2025",
    rating: 5,
    description: "Professional audio workstation for recording, mixing, and restoring audio.",
    installSteps: ["Extract archive", "Run installer", "Complete setup", "Run activation patch"],
    features: ["Multi-track editing", "Audio restoration", "Effects processing", "Spectral display", "Batch processing", "Auto-ducking"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "8GB RAM", "2GB disk space", "Professional audio interface recommended", "Intel i5/i7 or AMD equivalent"]
  },
  {
    id: "adobe-fresco",
    name: "Adobe Fresco",
    icon: "https://i.imgur.com/BCoypCw.png",
    version: "5.0",
    releaseDate: "January 2025",
    rating: 4,
    description: "Digital painting app with live brushes and vector tools.",
    installSteps: ["Extract with password", "Run installer", "Follow instructions", "Apply activation"],
    features: ["Live brushes technology", "Vector brushes", "Pixel brushes", "Pressure sensitivity", "Cloud document support", "Time-lapse recording"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "8GB RAM", "2GB disk space", "Touch screen recommended", "Pen input supported"]
  },
  {
    id: "adobe-indesign",
    name: "Adobe InDesign",
    icon: "https://i.imgur.com/vDLoTEm.png",
    version: "2025",
    releaseDate: "March 2025",
    rating: 5,
    description: "Industry-standard page design software for print and digital publishing.",
    installSteps: ["Extract archive", "Run setup", "Follow wizard", "Apply crack after installation"],
    features: ["Page layout tools", "Typography controls", "Master pages", "Interactive documents", "Digital publishing", "Book creation tools"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "8GB RAM", "2GB disk space", "1024x768 display (1920x1080 recommended)", "Intel processor"]
  },
  {
    id: "adobe-animate",
    name: "Adobe Animate",
    icon: "https://i.imgur.com/EjRjD5d.png",
    version: "2025",
    releaseDate: "March 2025",
    rating: 4,
    description: "Animation software for creating interactive vector animations.",
    installSteps: ["Extract files", "Run installer", "Complete setup", "Run activation tool"],
    features: ["Vector animation tools", "Frame-by-frame animation", "Motion tweening", "Audio synchronization", "Camera tools", "HTML5 Canvas output"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "8GB RAM", "2GB disk space", "1280x1024 display", "Intel Core i5 or equivalent"]
  },
  {
    id: "wallpaper-engine",
    name: "Wallpaper Engine",
    icon: "https://i.imgur.com/HHxK0lX.png",
    version: "2.6",
    releaseDate: "December 2024",
    rating: 5,
    description: "Live wallpaper creation and customization tool with Steam Workshop support.",
    installSteps: ["Extract archive", "Run setup", "Choose installation location", "Apply included license"],
    features: ["Interactive wallpapers", "Audio visualizers", "Video wallpapers", "Multiple monitor support", "Low resource usage", "Steam Workshop integration"],
    systemRequirements: ["Windows 7/8/10/11", "2GB RAM", "1GB disk space", "DirectX 10 compatible GPU", "Dual-core CPU"]
  },
  {
    id: "adobe-xd-2025",
    name: "Adobe XD 2025",
    icon: "https://i.imgur.com/9KlWvV1.png",
    version: "57.0",
    releaseDate: "March 2025",
    rating: 5,
    description: "User experience design tool for creating prototypes, wireframes, and interactive designs.",
    installSteps: ["Extract archive with password", "Run installer", "Complete setup wizard", "Apply activation patch"],
    features: ["Interactive prototyping", "Auto-animate transitions", "Voice prototyping", "Design system support", "Real-time collaboration", "Plugin ecosystem"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "8GB RAM", "4GB disk space", "1280x800 screen resolution", "Internet connection for collaboration"]
  },
  {
    id: "adobe-bridge-2025",
    name: "Adobe Bridge 2025",
    icon: "https://i.imgur.com/2J8kLpP.png",
    version: "15.0",
    releaseDate: "March 2025",
    rating: 4,
    description: "Digital asset management software for organizing and browsing creative files.",
    installSteps: ["Extract files", "Run setup", "Follow installation wizard", "Apply crack after completion"],
    features: ["File browsing and organization", "Batch processing", "Metadata editing", "Preview generation", "Adobe integration", "Watermark creation"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "4GB RAM", "2GB disk space", "1024x768 screen resolution", "Multi-core processor"]
  },
  {
    id: "corel-videostudio-2025",
    name: "Corel VideoStudio Ultimate 2025",
    icon: "https://i.imgur.com/7FgHjK2.png",
    version: "X15 Ultimate",
    releaseDate: "February 2025",
    rating: 4,
    description: "Consumer video editing software with professional features and easy-to-use interface.",
    installSteps: ["Extract with password", "Run installer", "Select installation options", "Apply serial key and patch"],
    features: ["Multi-track timeline editing", "Motion tracking", "360-degree video editing", "Screen recording", "Time remapping", "Audio tools"],
    systemRequirements: ["Windows 10/11 64-bit", "8GB RAM", "Intel i5 or AMD equivalent", "4GB disk space", "DirectX 11 compatible GPU"]
  },
  {
    id: "magix-vegas-effects",
    name: "MAGIX Vegas Effects",
    icon: "https://i.imgur.com/8VbN2kL.png",
    version: "2.0",
    releaseDate: "January 2025",
    rating: 4,
    description: "Professional video effects and compositing software for advanced post-production.",
    installSteps: ["Extract archive", "Run setup file", "Complete installation", "Run keygen and activate"],
    features: ["Advanced compositing", "Motion graphics", "3D particle effects", "Color correction", "Keying tools", "Audio synchronization"],
    systemRequirements: ["Windows 10/11 64-bit", "16GB RAM", "NVIDIA/AMD GPU with 4GB VRAM", "8GB disk space", "Intel i7 or AMD Ryzen 7"]
  },
  {
    id: "serato-dj-pro",
    name: "Serato DJ Pro",
    icon: "https://i.imgur.com/3HgKjR8.png",
    version: "3.2",
    releaseDate: "December 2024",
    rating: 5,
    description: "Professional DJ software with club-standard features and hardware integration.",
    installSteps: ["Extract files with password", "Install software", "Complete setup", "Apply crack and run as admin"],
    features: ["Professional DJ mixing", "Hardware controller support", "Video mixing capabilities", "Stem separation", "Practice mode", "Recording functionality"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "8GB RAM", "DJ controller (optional)", "2GB disk space", "USB ports for hardware"]
  },
  {
    id: "adobe-captivate-2025",
    name: "Adobe Captivate 2025",
    icon: "https://i.imgur.com/5JkL8nP.png",
    version: "12.4",
    releaseDate: "February 2025",
    rating: 4,
    description: "E-learning authoring tool for creating interactive content and responsive courses.",
    installSteps: ["Extract archive", "Run installer", "Follow setup instructions", "Apply activation tool"],
    features: ["Responsive course design", "Interactive simulations", "Virtual reality support", "Assessment tools", "Video embedding", "SCORM compliance"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "8GB RAM", "4GB disk space", "1024x768 screen resolution", "Internet connection for publishing"]
  },
  {
    id: "pinnacle-studio-26",
    name: "Pinnacle Studio 26 Ultimate",
    icon: "https://i.imgur.com/9MnH7kQ.png",
    version: "26.0",
    releaseDate: "March 2025",
    rating: 4,
    description: "Feature-rich video editing software for creative video production and storytelling.",
    installSteps: ["Extract files", "Run setup", "Choose components", "Apply crack after installation"],
    features: ["Multi-camera editing", "Motion tracking", "360-degree video support", "Split screen video", "Color grading", "Audio editing tools"],
    systemRequirements: ["Windows 10/11 64-bit", "8GB RAM", "Intel i5 or AMD equivalent", "8GB disk space", "DirectX 11 compatible GPU"]
  },
  {
    id: "solidworks-2025",
    name: "SolidWorks 2025",
    icon: "https://i.imgur.com/4HgF2nR.png",
    version: "Premium 2025",
    releaseDate: "January 2025",
    rating: 5,
    description: "Professional 3D CAD design software for mechanical engineering and product development.",
    installSteps: ["Extract archive with password", "Run installer as admin", "Select installation options", "Apply license activator"],
    features: ["3D modeling and assemblies", "Simulation and analysis", "Technical drawings", "Sheet metal design", "Weldments", "Rendering capabilities"],
    systemRequirements: ["Windows 10/11 64-bit", "32GB RAM", "NVIDIA Quadro or equivalent", "25GB disk space", "Intel i7 or AMD Ryzen 7"]
  },
  {
    id: "zbrush-2025",
    name: "ZBrush 2025",
    icon: "https://i.imgur.com/6KjH9nL.png",
    version: "2025.1",
    releaseDate: "February 2025",
    rating: 5,
    description: "Digital sculpting and painting program for creating detailed 3D models and artwork.",
    installSteps: ["Extract files", "Run installer", "Complete setup process", "Apply license patch"],
    features: ["High-resolution sculpting", "Advanced brushes", "Retopology tools", "Texturing and painting", "3D printing support", "Animation timeline"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "16GB RAM", "NVIDIA/AMD GPU with 4GB VRAM", "8GB disk space", "Wacom tablet recommended"]
  },
  {
    id: "wondershare-uniconverter",
    name: "Wondershare UniConverter",
    icon: "https://i.imgur.com/8LkJ2nM.png",
    version: "15.5",
    releaseDate: "January 2025",
    rating: 4,
    description: "Complete video toolbox for converting, editing, downloading, and burning videos.",
    installSteps: ["Extract archive", "Install software", "Follow wizard steps", "Run crack to activate"],
    features: ["Video format conversion", "Video downloading", "DVD burning", "Screen recording", "Video editing tools", "Batch processing"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "4GB RAM", "2GB disk space", "1GHz processor", "Internet connection for downloads"]
  },
  {
    id: "adobe-robohelp-2025",
    name: "Adobe RoboHelp 2025",
    icon: "https://i.imgur.com/9NkP7nQ.png",
    version: "2025.1",
    releaseDate: "March 2025",
    rating: 4,
    description: "Help authoring tool for creating and publishing help systems, knowledge bases, and documentation.",
    installSteps: ["Extract with password", "Run installer", "Complete setup", "Apply activation patch"],
    features: ["Responsive help output", "Content management", "Conditional text", "Multi-format publishing", "Translation support", "Template library"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "8GB RAM", "4GB disk space", "1024x768 screen resolution", "Web browser for preview"]
  },
  {
    id: "avs-video-editor",
    name: "AVS Video Editor",
    icon: "https://i.imgur.com/3LnK8mH.png",
    version: "9.8",
    releaseDate: "December 2024",
    rating: 4,
    description: "Easy-to-use video editing software with professional features for creating stunning videos.",
    installSteps: ["Extract files", "Run setup", "Install components", "Apply registration key"],
    features: ["Timeline video editing", "Special effects library", "Audio editing", "DVD authoring", "Slideshow creation", "Screen capture"],
    systemRequirements: ["Windows 10/11", "4GB RAM", "Intel/AMD processor", "2GB disk space", "DirectX compatible sound card"]
  },
  {
    id: "nitro-pdf-pro-14",
    name: "Nitro PDF Pro 14",
    icon: "https://i.imgur.com/7YbL2nK.png",
    version: "14.26",
    releaseDate: "February 2025",
    rating: 4,
    description: "Professional PDF editor and converter with advanced document management features.",
    installSteps: ["Extract archive", "Run installer", "Complete installation", "Apply crack and license"],
    features: ["PDF editing and creation", "Document conversion", "Digital signatures", "Form creation", "OCR text recognition", "Collaboration tools"],
    systemRequirements: ["Windows 10/11 or macOS 11+", "4GB RAM", "2GB disk space", "1024x768 screen resolution", "Internet connection for updates"]
  },
  {
    id: "advanced-systemcare-pro",
    name: "Advanced SystemCare Pro",
    icon: "https://i.imgur.com/5HnK9mL.png",
    version: "17.4",
    releaseDate: "January 2025",
    rating: 4,
    description: "Complete PC optimization and security software for cleaning, speeding up, and protecting your computer.",
    installSteps: ["Extract files with password", "Run installer", "Complete setup", "Apply license key"],
    features: ["System optimization", "Registry cleaning", "Malware protection", "Privacy protection", "Startup optimization", "Real-time monitoring"],
    systemRequirements: ["Windows 7/8/10/11", "2GB RAM", "1GB disk space", "1GHz processor", "Internet connection for updates"]
  }
];

// Combine all software
const allSoftware = [...softwareData, ...remainingSoftware];

// Generate dynamic reviews with dates relative to the current day
const generateReviewsData = (): ReviewItem[] => {
  const today = new Date();
  
  const reviewsText = [
    "Incredibly reliable source for software. Everything works flawlessly and installation was simple. Highly recommended for all professionals.",
    "Adobe Photoshop working perfectly! No issues with activation and all features are available. The download was super fast too.",
    "Great service overall. The DaVinci Resolve download was fast and installation was straightforward. Would definitely use again.",
    "FL Studio is running perfectly. All plugins included and working. Highly recommended! No bugs or issues so far.",
    "Fantastic resource for professionals. Adobe suite works flawlessly. Will definitely return for more software needs.",
    "The results from Topaz AI are amazing — very impressed!",
    "Best version of Premiere Pro I've used. All features work perfectly and render times are much better than expected.",
    "CapCut Pro is incredible! It works perfectly for my YouTube content.",
    "The Trading Bot software works exactly as described. Already seeing positive results after just a few days of use.",
    "Substance 3D is incredible for my design work. All tools are functioning properly and the interface is intuitive.",
    "Adobe Illustrator installation was quick and easy. No crashes or bugs after a week of heavy use.",
    "IDM is a game-changer for downloads. Much faster than my previous download manager and the scheduling feature is great.",
    "The Proton VPN premium features are excellent. Fast speeds and the secure core servers work perfectly.",
    "Lightroom has never run better on my system. Presets work flawlessly and editing is super smooth.",
    "CorelDRAW suite installed without any issues. All components working as expected and very stable.",
    "Flawless setup and performance – Adobe After Effects AI",
    "Acrobat Pro makes document management so much easier. OCR features work perfectly on all my documents.",
    "Wondershare Filmora has excellent effects and the interface is very user-friendly. Great for beginners.",
    "Wallpaper Engine is amazing value. The interactive wallpapers look stunning on my dual monitor setup.",
    "Media Encoder batch processing works flawlessly. Saved me hours of work already."
  ];
  
  const names = [
    "Alex M.", "Sarah K.", "Michael T.", "Jessica R.", "David N.",
    "Emma L.", "Thomas W.", "Olivia J.", "James D.", "Sophia H.",
    "Benjamin F.", "Amelia S.", "William P.", "Ava G.", "Lucas B.",
    "Mia C.", "Henry E.", "Charlotte O.", "Alexander R.", "Emily Z."
  ];
  
  return reviewsText.map((comment, index) => {
    // Create dates ranging from today to 19 days ago
    const daysAgo = index === 0 ? 0 : Math.ceil(index * 1.5);
    return {
      id: index + 1,
      name: names[index],
      rating: Math.floor(Math.random() * 2) + 4, // Ratings between 4-5
      comment,
      date: subDays(today, daysAgo)
    };
  });
};

const Index = () => {
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewsData, setReviewsData] = useState<ReviewItem[]>([]);
  const [animationTriggered, setAnimationTriggered] = useState(false);
  
  const { t } = useLanguage();
  
  const softwareGridRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const installStepsRef = useRef<HTMLDivElement>(null);
  
  // Generate reviews on component mount
  useEffect(() => {
    setReviewsData(generateReviewsData());
    // Trigger initial animations after a short delay
    setTimeout(() => {
      setAnimationTriggered(true);
    }, 100);
  }, []);
  
  // Handle scroll reveal animation
  useEffect(() => {
    const handleScrollAnimation = () => {
      const reveals = document.querySelectorAll(".reveal");
      
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };
    
    window.addEventListener("scroll", handleScrollAnimation);
    handleScrollAnimation(); // Initial check on mount
    
    return () => window.removeEventListener("scroll", handleScrollAnimation);
  }, []);
  
  // Handle software selection
  const handleSoftwareClick = (software: SoftwareItem) => {
    setSelectedSoftware(software);
    setIsModalOpen(true);
  };
  
  // Filter software by search query
  const filteredSoftware = allSoftware.filter(software => 
    software.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div id="home" className="min-h-screen bg-background relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-glow-radial opacity-30 z-0"></div>
        
        <Navbar />
        
        {/* Hero section */}
        <section className="relative pt-32 pb-20 px-4 container mx-auto flex flex-col items-center text-center z-10">
          <h1 className={`text-3xl md:text-5xl font-light mb-6 max-w-3xl fade-in-up ${animationTriggered ? 'opacity-100' : 'opacity-0'}`}>
            {t("browseCollection")} <span className="gradient-text">{t("softwareTools")}</span>
          </h1>
          <p className={`text-white/70 max-w-xl text-lg mb-10 fade-in-up stagger-1 ${animationTriggered ? 'opacity-100' : 'opacity-0'}`}>
            {t("seeWhatUsers")}
          </p>
          <button 
            className={`neumorphic-button px-8 py-3 text-blue-400 font-light pulse-glow interactive-hover fade-in-up stagger-2 ${animationTriggered ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => softwareGridRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t("exploreMore")}
          </button>
        </section>
        
        {/* Software Grid Section */}
        <section id="software" ref={softwareGridRef} className="py-16 px-4 container mx-auto relative z-10">
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between reveal">
            <div>
              <h2 className="text-2xl md:text-3xl font-light mb-2">{t("softwareCatalog")}</h2>
              <p className="text-white/60">{t("browseCollection")} <span className="gradient-text">{t("softwareTools")}</span></p>
            </div>
            <div className="mt-4 md:mt-0 max-w-md w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("searchSoftware")}
                  className="w-full bg-muted/30 border border-white/10 rounded-lg py-2 px-4 pl-10 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-white/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
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
        </section>
        
        {/* Reviews Section */}
        <section id="reviews" ref={reviewsRef} className="py-16 px-4 container mx-auto bg-glow-radial bg-fixed bg-no-repeat bg-center relative z-10">
          <div className="text-center mb-12 reveal">
            <h2 className="text-2xl md:text-3xl font-light mb-2">{t("userReviews")}</h2>
            <p className="text-white/60 max-w-xl mx-auto">{t("seeWhatUsers")}</p>
          </div>
          
          <div className="reveal">
            <ReviewsCarousel reviews={reviewsData} />
          </div>
        </section>
        
        {/* How to Install Section */}
        <section id="how-to-install" ref={installStepsRef} className="py-16 px-4 container mx-auto relative z-10">
          <div className="text-center mb-12 reveal">
            <h2 className="text-2xl md:text-3xl font-light mb-2">{t("howToInstallSection")}</h2>
            <p className="text-white/60 max-w-xl mx-auto">{t("followSteps")}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal">
            <InstallStep 
              number={1} 
              title={t("downloadStep")} 
              description={t("downloadDesc")}
              delay={100}
              className="float stagger-1"
            />
            <InstallStep 
              number={2} 
              title={t("extractStep")} 
              description={t("extractDesc")}
              delay={200}
              className="float stagger-2"
            />
            <InstallStep 
              number={3} 
              title={t("installStep")} 
              description={t("installDesc")}
              delay={300}
              className="float stagger-3"
            />
            <InstallStep 
              number={4} 
              title={t("activateStep")} 
              description={t("activateDesc")}
              delay={400}
              className="float stagger-4"
            />
          </div>
        </section>
        
        <Footer />
        
        {/* Software Modal */}
        <SoftwareModal 
          software={selectedSoftware} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </>
  );
};

export default Index;
