import CrawlerControl from '../components/CrawlerControl';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <CrawlerControl />
        </div>
    );
}
