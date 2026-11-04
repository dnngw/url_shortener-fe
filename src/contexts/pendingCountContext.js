import { createContext } from "react";

// Number of users waiting for approval, shared by the sidebar badge and admin pages
export const PendingCountContext = createContext(null);
