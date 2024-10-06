"use server";

import { revalidatePath } from "next/cache";
import { db } from ".."; // 确保你已经正确导入了数据库连接
import { sum } from "../schema"; // 确保你已经正确导入了表结构
import { v4 as uuidv4 } from "uuid";
import { sql } from "drizzle-orm";

// 插入新记录
export async function createPost(formData) {
  const drugName = formData.get("drugName")?.toString();
  if (!drugName) {
    return { error: "Drug Name is required" };
  }

  const newRecord = {
    id: uuidv4(),
    drugName,
    createdAt: new Date().toISOString(), // 格式化为年月日
    updatedAt: new Date().toISOString(), // 格式化为年月日
  };

  try {
    await db.insert(sum).values(newRecord).run();
    revalidatePath("/");
    return { success: "Record Created" };
  } catch (error) {
    console.error("Error creating record:", error);
    return { error: "Failed to create record" };
  }
}

// 更新记录
export async function updatePost(id, formData) {
  const drugName = formData.get("drugName")?.toString();
  if (!drugName) {
    return { error: "Drug Name is required" };
  }

  const updatedAt = new Date().toISOString(); // 格式化为年月日

  try {
    await db
      .update(sum)
      .set({ drugName, updatedAt })
      .where(sql`id = ${id}`)
      .run();
    revalidatePath("/");
    return { success: "Record Updated" };
  } catch (error) {
    console.error("Error updating record:", error);
    return { error: "Failed to update record" };
  }
}

// 删除记录
export async function deletePost(id) {
  try {
    await db
      .delete(sum)
      .where(sql`id = ${id}`)
      .run();
    revalidatePath("/");
    return { success: "Record Deleted" };
  } catch (error) {
    console.error("Error deleting record:", error);
    return { error: "Failed to delete record" };
  }
}

// 查询记录
export async function getPost(id) {
  try {
    const result = await db
      .select()
      .from(sum)
      .where(sql`id = ${id}`)
      .get();
    return result;
  } catch (error) {
    console.error("Error querying record:", error);
    return { error: "Failed to query record" };
  }
}

// 查询所有记录
export async function getAllPosts(page = 1, pageSize = 6) {
  try {
    const offset = (page - 1) * pageSize;
    const results = await db
      .select()
      .from(sum)
      .limit(pageSize)
      .offset(offset)
      .all();

    const totalRecords = await db
      .select({ count: sql`COUNT(*)` })
      .from(sum)
      .get();
    const totalPages = Math.ceil(totalRecords.count / pageSize);

    return {
      posts: results,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error querying all records:", error);
    return { error: "Failed to query all records" };
  }
}
