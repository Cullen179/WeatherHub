import { Suspense } from 'react';
import { fetchRecommendation } from './fetch';

export default async function AIRecommendation() {
  const recommendations = await fetchRecommendation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <p>{recommendations.message.content}</p>
    </Suspense>
  );
}
