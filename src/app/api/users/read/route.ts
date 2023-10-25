
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { decode } from "querystring";

export async function GET(req: Request)
{
    const url = req.url;
    // console.log(url)
    const qsMatch = url.match(/(?=\?).*/)
    let qs: string = "";
    if (qsMatch)
    {
        qs = qsMatch[0].substring(1);
    }
    const args = decode(qs);

    // if (Object.keys(args).length > 0)
    {
        const query: Prisma.UserFindManyArgs = {};
        const where: Prisma.UserWhereInput = {};
        let returnCount = false;
        // const keys: string[] = Object.keys(args);
        Object.keys(args).forEach(function(key: string)
        {
            if (key == "getcount")
            {
                returnCount = true
            }
            else if (key == "id")
            {
                where.id = parseInt(args[key] as string);
            }
            else if (key == "start")
            {
                query.skip = parseInt(args[key] as string);
            }
            else if (key == "count")
            {
                query.take = parseInt( args[key] as string)
            }
            else if (key == 'search')
            {
                where.name = { contains: args[key] as string }
            }
            else if (["getcount"].indexOf(key) < 0)
            {
                where[key] = args[key] as string;
            }
        })
        // if (args.id)
        // {
        //     where.id = parseInt(Array.isArray(args.id) ? args.id.join('') : args.id)
        //     // const result = await prisma.user.findFirst({where: {id: parseInt(id)}});
        //     // return new Response(JSON.stringify(result))
        // }
        // if (args.role)
        // {
        //     where.role = Array.isArray(args.role) ? args.role.join('') : args.role
        //     // return new Response(JSON.stringify(result))
        // }
        if (returnCount)
        {
            const count = await prisma.user.count({where: where})
            return new Response(JSON.stringify({count: count}));
        }
        query["where"] = where
        const result = await prisma.user.findMany(query);
        return new Response(JSON.stringify(result), {headers: [["Access-Control-Allow-Origin", "*"]]});
    }

    return new Response(JSON.stringify(await prisma.user.findMany({})))

}