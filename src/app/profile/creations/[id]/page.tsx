import ArtworkClient from './artwork-client'

export default async function ArtworkPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  return <ArtworkClient id={id} />;
}
