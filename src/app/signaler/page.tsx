import ContentMap from "./components/ContentMap";
import ReportForm from "./components/Form";

export default function SignalerPage() {
    return (
        <main className="flex-1">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,440px)_1fr] lg:items-stretch">
                <ReportForm />
                <ContentMap />
            </div>
        </main>
    );
}