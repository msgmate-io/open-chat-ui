export function AudioLevelDisplay() {
    const dbfsLevels = [-60, -50, -40, -30, -20]

    const dbfsToHeight = (dbfs: number) => {
        return 100 - (dbfs + 60) * 2
    }

    return (
        <div className='h-[150px] flex flex-row items-center content-center justify-center gap-2'>
            {dbfsLevels.map((dbfs) => (
                <div
                    key={dbfs}
                    className='w-[30px] rounded-full bg-info'
                    style={{ height: dbfsToHeight(dbfs) + '%' }}
                ></div>
            ))}
        </div>
    )
}
