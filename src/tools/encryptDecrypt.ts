export function encryptDecrypt(inpString:any)
{
    inpString = inpString.split("");
    let xorKey = 'P';

    let len = inpString.length;

    for (let i = 0; i < len; i++)
    {
        inpString[i] = (String.fromCharCode((inpString[i].charCodeAt(0)) ^ xorKey.charCodeAt(0)));
    }
    return inpString.join("");
}
