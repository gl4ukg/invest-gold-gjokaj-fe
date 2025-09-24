'use client';

export default function RingsFAQSchema() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Ku mund të gjej unaza martese në Gjakovë?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Invest Gold Gjokaj ofron koleksionin më të mirë të unazave të martesës në Gjakovë. Ne kemi një përzgjedhje të gjerë të unazave të arit, të punuara me mjeshtëri dhe të personalizuara sipas dëshirës tuaj.'
        }
      },
      {
        '@type': 'Question',
        name: 'Si të zgjedh unazën e duhur të fejesës?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Në Invest Gold Gjokaj, ne ju ndihmojmë të zgjidhni unazën perfekte të fejesës duke marrë parasysh stilin tuaj personal, buxhetin dhe preferencat. Ofrojmë një gamë të gjerë të unazave të fejesës, nga dizajne klasike deri tek ato moderne.'
        }
      },
      {
        '@type': 'Question',
        name: 'A mund të personalizoj unazat e martesës?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Po, në Invest Gold Gjokaj ju mund të personalizoni plotësisht unazat tuaja të martesës. Nga zgjedhja e dizajnit, materialit dhe detajeve, deri tek gdhendja e mesazheve personale.'
        }
      },
      {
        '@type': 'Question',
        name: 'Sa kushtojnë rrathet e fejesës në Gjakovë?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Çmimet e unazave të fejesës në Invest Gold Gjokaj variojnë bazuar në dizajnin, peshën e arit dhe detajet e personalizimit. Ne ofrojmë një gamë të gjerë çmimesh për të përshtatur çdo buxhet.'
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
