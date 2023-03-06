import path from "path";

export const ROOT_FOLDER = process.cwd();

export const PUBLIC_FOLDER = path.join(ROOT_FOLDER, "public");

export const TEMPLATES_DIR = path.resolve(PUBLIC_FOLDER, "templates");
