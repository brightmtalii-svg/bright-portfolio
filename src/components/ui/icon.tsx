import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Atom,
  Book,
  Blocks,
  Brain,
  Braces,
  Boxes,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  CircuitBoard,
  CircleCheck,
  Cloud,
  Code,
  Compass,
  Copy,
  Cpu,
  Database,
  Download,
  Eye,
  ExternalLink,
  Funnel,
  Gauge,
  GraduationCap,
  Info,
  Layers,
  LayoutDashboard,
  Lightbulb,
  LoaderCircle,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Moon,
  Puzzle,
  Quote,
  Rocket,
  Route,
  Search,
  Send,
  Server,
  Shield,
  Sparkles,
  Star,
  Sun,
  Target,
  Terminal,
  TriangleAlert,
  User,
  Workflow,
  Wrench,
  X,
  Zap,
  House,
  type LucideIcon,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

/**
 * Single icon registry so content files can reference icons by a stable string
 * key ("brain", "shield", …) instead of importing components.
 */
const registry: Record<string, LucideIcon | typeof GitHubIcon> = {
  home: House,
  user: User,
  layers: Layers,
  cpu: Cpu,
  route: Route,
  mail: Mail,
  sparkles: Sparkles,
  graduation: GraduationCap,
  code: Code,
  brain: Brain,
  chip: CircuitBoard,
  book: Book,
  braces: Braces,
  layout: LayoutDashboard,
  server: Server,
  wrench: Wrench,
  terminal: Terminal,
  blocks: Blocks,
  puzzle: Puzzle,
  compass: Compass,
  shield: Shield,
  atom: Atom,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  external: ExternalLink,
  download: Download,
  send: Send,
  check: Check,
  search: Search,
  filter: Funnel,
  close: X,
  copy: Copy,
  bulb: Lightbulb,
  rocket: Rocket,
  target: Target,
  quote: Quote,
  info: Info,
  message: MessageSquare,
  mapPin: MapPin,
  calendar: Calendar,
  star: Star,
  zap: Zap,
  eye: Eye,
  gauge: Gauge,
  boxes: Boxes,
  database: Database,
  cloud: Cloud,
  workflow: Workflow,
  arrowUp: ArrowUp,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  arrowUpRight: ArrowUpRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  loader: LoaderCircle,
  alert: TriangleAlert,
  checkCircle: CircleCheck,
  menu: Menu,
  sun: Sun,
  moon: Moon,
};

export interface IconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
  "aria-hidden"?: boolean;
}

export function Icon({ name, className, strokeWidth = 1.75, ...rest }: IconProps) {
  const Component = registry[name] ?? Sparkles;
  return (
    <Component
      className={cn("size-5 shrink-0", className)}
      strokeWidth={strokeWidth}
      aria-hidden={rest["aria-hidden"] ?? true}
    />
  );
}

export function hasIcon(name: string): boolean {
  return name in registry;
}
