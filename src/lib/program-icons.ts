import {
  Moon,
  MessageCircle,
  Flame,
  Footprints,
  HeartHandshake,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ProgramIconName =
  | "moon"
  | "message-circle"
  | "flame"
  | "footprints"
  | "heart-handshake"
  | "users";

export const PROGRAM_ICONS: Record<ProgramIconName, LucideIcon> = {
  moon: Moon,
  "message-circle": MessageCircle,
  flame: Flame,
  footprints: Footprints,
  "heart-handshake": HeartHandshake,
  users: Users,
};
