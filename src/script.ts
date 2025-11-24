import { Router } from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";
import { encryptDecrypt } from "./tools/encryptDecrypt";

const router = Router();
const prisma = new PrismaClient();


// POST /users
router.post("/", async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "name dan email wajib diisi",
            });
        }

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
        },
    });

    res.status(201).json({
        message: "User berhasil dibuat",
        data: newUser,
    });
    } catch (err: any) {
        res.status(500).json({
            message: "Error",
            error: err.message,
        });
    }
});

router.post("/new-note", async(req:Request, res: Response)=>{
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Pastikan data sudah terisi",
            });
        }
    
    const titleEncrypted = await encryptDecrypt(title);
    const descEncrypted = await encryptDecrypt(description);
    const newNote = await prisma.message.create({
        data: {
            title:titleEncrypted,
            description: descEncrypted,
            userId:1
        },
    });

    return res.status(201).json(
        {
            status: "Success",
            message: newNote,
        }
    );
    } catch (err: any) {
        return res.status(500).json(
            {
                message: "Error",
                error: err.message,
            }
        );
    }
})

router.get("/new-note", async(req: Request, res:Response)=>{
    try {
        const data = await prisma.message.findMany()
        const decryptedData = data.map(item => ({
            ...item,
            title: encryptDecrypt(item.title),          // decrypt title
            description: encryptDecrypt(item.description) // decrypt description
        }));
        return res.status(200).json(
            {
                status:"success",
                message:{
                    data :decryptedData
                }
            }
        )
    } catch (error) {
        return res.status(500).json(
            {
                status:"error",
                message:error
            }
        )
    }
})

router.put("/new-note/edit", async(req:Request, res:Response)=>{
    const {title, description}=req.body
    try {
    const updateNote = await prisma.message.update({
        where:{
            id:1
        },
        data:{
            title:title, 
            description: description,
        }
    })
    return res.status(200).json(
        {
            status:"success",
            message:updateNote
        }
    )     
    } catch (error) {
        return res.status(500).json(
            {
                status:"error",
                message:error
            }
        )
    }
})

export default router;
