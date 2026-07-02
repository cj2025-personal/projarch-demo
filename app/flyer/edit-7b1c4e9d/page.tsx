import { redirect } from "next/navigation";
import { flyerEditorPath } from "../../lib/flyerAuth";

export default function LegacyFlyerEditorPage() {
  redirect(flyerEditorPath);
}
