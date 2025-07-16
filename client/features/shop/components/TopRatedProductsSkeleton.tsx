import { Box, Skeleton, Stack } from "@mui/material";

export default function TopRatedProductsSkeleton() {
    return (
        <div className="container flex flex-wrap justify-between">
            <Stack sx={{width: '100%', maxWidth: '45rem'}}>
                <Stack spacing={1} className="mb-4">
                    <div className="flex">
                        <Skeleton variant="rectangular" width={90} height={90} />
                        <Stack className="flex-1 ms-3 mt-1" spacing={1}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </Stack>
                    </div>
                </Stack>
                <Stack spacing={1}>
                    <div className="flex">
                        <Skeleton variant="rectangular" width={90} height={90} />
                        <Stack className="flex-1 ms-3 mt-1" spacing={1}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </Stack>
                    </div>
                </Stack>
            </Stack>
            <Stack sx={{width: '100%', maxWidth: '45rem'}}>
                <Stack spacing={1} className="mb-4">
                    <div className="flex">
                        <Skeleton variant="rectangular" width={90} height={90} />
                        <Stack className="flex-1 ms-3 mt-1" spacing={1}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </Stack>
                    </div>
                </Stack>
                <Stack spacing={1}>
                    <div className="flex">
                        <Skeleton variant="rectangular" width={90} height={90} />
                        <Stack className="flex-1 ms-3 mt-1" spacing={1}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </Stack>
                    </div>
                </Stack>
            </Stack>
            <Stack sx={{width: '100%', maxWidth: '45rem'}}>
                <Stack spacing={1} className="mb-4">
                    <div className="flex">
                        <Skeleton variant="rectangular" width={90} height={90} />
                        <Stack className="flex-1 ms-3 mt-1" spacing={1}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </Stack>
                    </div>
                </Stack>
                <Stack spacing={1}>
                    <div className="flex">
                        <Skeleton variant="rectangular" width={90} height={90} />
                        <Stack className="flex-1 ms-3 mt-1" spacing={1}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </Stack>
                    </div>
                </Stack>
            </Stack>
        </div>
    )
}