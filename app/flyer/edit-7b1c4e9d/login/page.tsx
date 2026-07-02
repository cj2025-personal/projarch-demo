import { redirect } from "next/navigation";
import { flyerEditorLoginPath } from "../../../lib/flyerAuth";

export default function LegacyFlyerEditorLoginPage() {
  redirect(flyerEditorLoginPath);
}
