import { trpc } from '../utils/trpc';
export default function IndexPage() {

  const user = trpc.userById.useQuery('1');

  if (!user.data) return <div>Loading...</div>;
  return (
    <div>
      <p>{user.data.name}</p>
    </div>
  );
}