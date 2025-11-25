import { Router } from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";
import { encryptDecrypt } from "./tools/encryptDecrypt";

const router = Router();
const prisma = new PrismaClient();


//CREATE DATA
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
    await prisma.message.create({
        data: {
            title:titleEncrypted,
            description: descEncrypted
        },
    });

    return res.send(`
        <script>
            alert("Catatan berhasil disimpan!");
            window.location.href = "/";
        </script>
    `);
    } catch (err: any) {
        return res.status(500).json(
            {
                message: "Error",
                error: err.message,
            }
        );
    }
})

//GET DATA
router.get("/", async(req: Request, res:Response)=>{
    try {
        const data = await prisma.message.findMany()
        const notes = data.map(item => ({
            ...item,
            title: encryptDecrypt(item.title),          // decrypt title
            description: encryptDecrypt(item.description) // decrypt description
        }));
        res.render("index", {notes:notes});
        // return res.status(200).json(
        //     {
        //         status:"success",
        //         message:{
        //             data :decryptedData
        //         }
        //     }
        // )
    } catch (error) {
        return res.status(500).json(
            {
                status:"error",
                message:error
            }
        )
    }
})

//GET UPDATE
router.get("/new-note/edit/:id", async(req:Request, res:Response)=>{
    try {
    const id = Number(req.params.id);
    const note = await prisma.message.findUnique({
        where:{id}
    })
    if (!note) return res.send("Data tidak ditemukan");

    const decryptedNote = {
    ...note,
    title: encryptDecrypt(note.title),
    description: encryptDecrypt(note.description),
    };

    res.render("edit", { note: decryptedNote });    
    } catch (error) {
        return res.status(500).json(
            {
                status:"error",
                message:error
            }
        )
    }
})

//UPDATE
router.post("/new-note/edit/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title, description } = req.body;

    await prisma.message.update({
        where: { id },
        data: {
        title: encryptDecrypt(title),       
        description: encryptDecrypt(description)
        },
    });

    return res.send(`
        <script>
            alert("Berhasil mengupdate catatan!");
            window.location.href = "/";
        </script>
    `);

    } catch (error) {
        return res.send(`
            <script>
            alert("Gagal update!");
            window.history.back();
        </script>
    `);
    }
});

//DELETE
router.post("/new-note/delete/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.message.delete({
        where: { id },
    });

    return res.send(`
      <script>
        alert("Catatan berhasil dihapus!");
        window.location.href = "/";
      </script>
    `);

  } catch (error) {
    return res.send(`
      <script>
        alert("Gagal menghapus catatan!");
        window.history.back();
      </script>
    `);
  }
});


export default router;
