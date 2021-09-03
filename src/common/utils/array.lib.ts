export function rotate<Type>(arr: Array<Type>, rotates: number): Array<Type>
{
    if (arr.length > rotates)
        arr.unshift(...arr.splice(-rotates));

    if (arr.length<= rotates)
    {
        for (let i=0; i<rotates; i++)
            arr.unshift(...arr.splice(-1));
    }

    return arr;
}