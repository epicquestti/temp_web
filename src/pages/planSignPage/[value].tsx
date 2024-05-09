import ViewWrapper from "@/components/ViewWrapper";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function PlanSignPage() {
  const router = useRouter();
  const { value } = router.query;
  return (
    <ViewWrapper>
      <Typography>Página de Assinatura de Plano</Typography>
      <Typography>{value}</Typography>
    </ViewWrapper>
  );
}
