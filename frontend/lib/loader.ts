"use server";

import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function loadFile(dirFilename: string): Promise<string> {
  const filePath = path.join(process.cwd(), dirFilename);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { /*data,*/ content } = matter(fileContent);
  return content;
};