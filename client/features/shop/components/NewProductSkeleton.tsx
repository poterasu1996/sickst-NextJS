import { Skeleton, Stack } from "@mui/material";

export default function NewProductSkeleton() {
    return (
        <div className="container">
            <div className="mt-12 flex justify-between">
                <Stack spacing={1}>
                    <Skeleton variant="rectangular" width={180} height={150} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Stack>
                <Stack spacing={1}>
                    <Skeleton variant="rectangular" width={180} height={150} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Stack>
                <Stack spacing={1}>
                    <Skeleton variant="rectangular" width={180} height={150} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Stack>
                <Stack spacing={1}>
                    <Skeleton variant="rectangular" width={180} height={150} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Stack>
                <Stack spacing={1}>
                    <Skeleton variant="rectangular" width={180} height={150} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Stack>
            </div>
        </div>
    )
}