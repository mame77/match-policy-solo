type Props = {
  params: { username: string };
};

const dummyUsers = [
  {
    username: 'sakura',
    name: 'さくら',
    age: 20,
    bio: 'カフェ巡りが趣味です！',
  },
  {
    username: 'takeshi',
    name: 'たけし',
    age: 25,
    bio: '筋トレとラーメンが好きです！',
  },
];

export default async function ProfilePage({ params }: Props) {
  const user = dummyUsers.find((u) => u.username === params.username);

  if (!user) {
    // Next.jsの `notFound()` はサーバー側でしか使えないので、こう返す
    return (
      <div className="p-6 text-red-500">ユーザーが見つかりませんでした</div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{user.name}さんのプロフィール</h1>
      <p className="mt-4">年齢: {user.age}</p>
      <p className="mt-2">自己紹介: {user.bio}</p>
    </div>
  );
}
