import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const [owner, repositoryName] = (process.env.GITHUB_REPOSITORY || "").split("/");
const isUserSite = repositoryName === `${owner}.github.io`;
const base = process.env.GITHUB_ACTIONS === "true" && repositoryName && !isUserSite
  ? `/${repositoryName}/`
  : "/";

export default defineConfig({
  base,
  plugins: [react()],
});
