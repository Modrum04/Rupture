import { Icon } from "@chakra-ui/react";

// Chakra v3 ne fournit plus de pack d'icônes : ces quelques tracés évitent
// d'ajouter une dépendance pour cinq symboles.
function TraceIcon({ children, ...props }) {
  return (
    <Icon
      // `as` est indispensable : sans lui, Icon active asChild et fusionne ses
      // props dans l'enfant unique — le <path> se retrouverait sans <svg> parent
      // et ne serait jamais peint.
      as="svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </Icon>
  );
}

export const SoleilIcon = (props) => (
  <TraceIcon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </TraceIcon>
);

export const LuneIcon = (props) => (
  <TraceIcon {...props}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </TraceIcon>
);

export const CorbeilleIcon = (props) => (
  <TraceIcon {...props}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
  </TraceIcon>
);

export const PlusIcon = (props) => (
  <TraceIcon {...props}>
    <path d="M12 5v14M5 12h14" />
  </TraceIcon>
);

export const TelechargerIcon = (props) => (
  <TraceIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </TraceIcon>
);

export const ReporterIcon = (props) => (
  <TraceIcon {...props}>
    <path d="M12 3v12M8 11l4 4 4-4M4 20h16" />
  </TraceIcon>
);
