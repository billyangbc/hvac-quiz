"use server";

import { promises as fs } from 'fs';
import matter from "gray-matter";

export async function loadFile(dirFilename: string): Promise<string> {
  const fileContent = await fs.readFile(process.cwd() + dirFilename, "utf8");
  const { /*data,*/ content } = matter(fileContent);
  return content;
};