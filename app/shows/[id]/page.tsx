
import ShowDetail from './ShowDetail';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

export default function ShowPage({ params }: { params: { id: string } }) {
  return <ShowDetail showId={params.id} />;
}
