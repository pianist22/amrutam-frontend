import { 
  LayoutDashboard, Stethoscope, Users, CalendarCheck, Star, Tag, Leaf, List, Plus, Wallet, RotateCcw 
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTicketAlt, faShareSquare, faCog, faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons';

// Helper to create path from label, e.g. "Add Ingredients" -> "/addingredients"
const toPath = (label) => '/' + label.replace(/\s+/g, '').toLowerCase();

export const sidebarItems = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-6 h-6" />, href: toPath("Dashboard") },
  { label: "Doctor", icon: <Stethoscope className="w-6 h-6" />, href: toPath("Doctor") },
  { label: "Patients", icon: <Users className="w-6 h-6" />, href: toPath("Patients") },
  { label: "Appointment", icon: <CalendarCheck className="w-6 h-6" />, href: toPath("Appointment") },
  { label: "Specialities", icon: <Star className="w-6 h-6" />, href: toPath("Specialities") },
  {
    label: "Ingredients",
    icon: <Leaf className="w-6 h-6" />,
    href: toPath("Ingredients"),
    children: [
      { label: "Ingredients List", icon: <List className="w-5 h-5" />, href: toPath("Ingredients/Ingredients_List") },
      { label: "Add Ingredients", icon: <Plus className="w-5 h-5" />, href: toPath("Ingredients/Add_Ingredients") },
    ],
  },
  { label: "Coupons", icon: <FontAwesomeIcon icon={faTicketAlt} className="w-6 h-6" />, href: toPath("Coupons") },
  { label: "Concerns", icon: <FontAwesomeIcon icon={faQuestionCircle} className="w-6 h-6" />, href: toPath("Concerns") },
  { label: "Referral", icon: <FontAwesomeIcon icon={faShareSquare} className="w-6 h-6" />, href: toPath("Referral") },
  { label: "Customization", icon: <FontAwesomeIcon icon={faCog} className="w-6 h-6" />, href: toPath("Customization") },
  { label: "Wallet", icon: <Wallet className="w-6 h-6" />, href: toPath("Wallet") },
  { label: "Refund", icon: <RotateCcw className="w-6 h-6" />, href: toPath("Refund") },
];
