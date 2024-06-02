export function AudioLevelDisplay({
    levels,
}: {
    levels: number[]
}) {

    const dbfsToHeight = (dbfs: number) => {
        return Math.max(10, dbfs + 100)
    }

    return (
        <div className='h-[150px] flex flex-row items-center content-center justify-center gap-2'>
            {levels.map((dbfs, index) => (
                <div
                    key={index}
                    className='w-[30px] rounded-full bg-info'
                    style={{ height: dbfsToHeight(dbfs) + '%' }}
                ></div>
            ))}
        </div>
    )
}
