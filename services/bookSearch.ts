export interface BookSuggestion {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  summary: string;
  suggestedGenres: string[];
  firstPublishYear?: number;
  workKey?: string;
}

export const DEFAULT_APP_GENRES = [
  'Indian Lit',
  'Mythological Fiction',
  'Classic Fiction',
  'Poetry',
  'Epic Drama',
  'Modern Fiction',
];

// Rich curated list for 0ms instant autocomplete suggestions & offline fallback
const CURATED_BOOKS: BookSuggestion[] = [
  {
    id: 'curated-1',
    title: "Midnight's Children",
    author: "Salman Rushdie",
    coverUrl: "https://covers.openlibrary.org/b/id/8346713-L.jpg",
    summary: "A masterpiece of magical realism recounting modern India's transition to independence through the eyes of Saleem Sinai, born at the stroke of midnight on August 15, 1947.",
    suggestedGenres: ["Magical Realism", "Historical Fiction", "Indian Lit"],
    firstPublishYear: 1981,
  },
  {
    id: 'curated-2',
    title: "The God of Small Things",
    author: "Arundhati Roy",
    coverUrl: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    summary: "Set in Ayemenem, Kerala, this Booker Prize-winning novel explores how small, everyday occurrences shape the fates of fraternal twins Rahel and Estha amidst love laws.",
    suggestedGenres: ["Literary Fiction", "Indian Lit", "Drama"],
    firstPublishYear: 1997,
  },
  {
    id: 'curated-3',
    title: "The Palace of Illusions",
    author: "Chitra Banerjee Divakaruni",
    coverUrl: "https://covers.openlibrary.org/b/id/8575003-L.jpg",
    summary: "A vivid reimagining of the world-famous Indian epic The Mahabharata told from the unique, compelling perspective of Panchaali (Draupadi).",
    suggestedGenres: ["Mythological Fiction", "Feminist Fiction", "Epic Drama"],
    firstPublishYear: 2008,
  },
  {
    id: 'curated-4',
    title: "The White Tiger",
    author: "Aravind Adiga",
    coverUrl: "https://covers.openlibrary.org/b/id/8235471-L.jpg",
    summary: "The compelling, dark, and witty story of Balram Halwai's journey from a humble village rickshaw-puller's son to a successful Bangalore entrepreneur.",
    suggestedGenres: ["Satire", "Dark Comedy", "Social Fiction", "Indian Lit"],
    firstPublishYear: 2008,
  },
  {
    id: 'curated-5',
    title: "A Suitable Boy",
    author: "Vikram Seth",
    coverUrl: "https://covers.openlibrary.org/b/id/8233777-L.jpg",
    summary: "Set in post-independence, post-partition India, following Lata Mehra whose mother is determined to find her a suitable match amidst four interconnected families.",
    suggestedGenres: ["Family Saga", "Historical Fiction", "Romance"],
    firstPublishYear: 1993,
  },
  {
    id: 'curated-6',
    title: "Train to Pakistan",
    author: "Khushwant Singh",
    coverUrl: "https://covers.openlibrary.org/b/id/8276632-L.jpg",
    summary: "A deeply human and heartbreaking historic account of the 1947 Partition of India in the fictional border village of Mano Majra.",
    suggestedGenres: ["Historical Fiction", "Partition Lit", "Drama"],
    firstPublishYear: 1956,
  },
  {
    id: 'curated-7',
    title: "Atomic Habits",
    author: "James Clear",
    coverUrl: "https://covers.openlibrary.org/b/id/12539702-L.jpg",
    summary: "An easy and proven way to build good habits and break bad ones. Small changes make a remarkable difference over time.",
    suggestedGenres: ["Self-Help & Psychology", "Personal Growth", "Productivity"],
    firstPublishYear: 2018,
  },
  {
    id: 'curated-8',
    title: "The Alchemist",
    author: "Paulo Coelho",
    coverUrl: "https://covers.openlibrary.org/b/id/11556106-L.jpg",
    summary: "A mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure and discovers his personal legend.",
    suggestedGenres: ["Philosophical Fiction", "Fable", "Adventure"],
    firstPublishYear: 1988,
  },
  {
    id: 'curated-9',
    title: "1984",
    author: "George Orwell",
    coverUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    summary: "A startling and haunting vision of the world under totalitarian rule, surveillance, Big Brother, and Thoughtcrime.",
    suggestedGenres: ["Dystopian", "Science Fiction", "Political Fiction"],
    firstPublishYear: 1949,
  },
  {
    id: 'curated-10',
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    coverUrl: "https://covers.openlibrary.org/b/id/8750873-L.jpg",
    summary: "A groundbreaking survey of the history of our species, exploring how biology and history have defined us and enhanced our understanding of what it means to be human.",
    suggestedGenres: ["Non-Fiction", "History & Anthropology", "Philosophy"],
    firstPublishYear: 2014,
  },
  {
    id: 'curated-11',
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverUrl: "https://covers.openlibrary.org/b/id/12836262-L.jpg",
    summary: "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know. It's about how you behave.",
    suggestedGenres: ["Personal Finance", "Psychology", "Business & Economics"],
    firstPublishYear: 2020,
  },
  {
    id: 'curated-12',
    title: "Dune",
    author: "Frank Herbert",
    coverUrl: "https://covers.openlibrary.org/b/id/12711018-L.jpg",
    summary: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
    suggestedGenres: ["Science Fiction", "Space Opera", "Fantasy"],
    firstPublishYear: 1965,
  },
  {
    id: 'curated-13',
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverUrl: "https://covers.openlibrary.org/b/id/8225261-L.jpg",
    summary: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, through Atticus Finch's defense of Tom Robinson.",
    suggestedGenres: ["Classic Fiction", "Legal Drama", "Coming of Age"],
    firstPublishYear: 1960,
  },
  {
    id: 'curated-14',
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverUrl: "https://covers.openlibrary.org/b/id/8225631-L.jpg",
    summary: "A portrait of the Jazz Age in all its decadence and excess, exploring themes of wealth, obsession, love, and the American dream.",
    suggestedGenres: ["Classic Fiction", "Literary Fiction", "Tragedy"],
    firstPublishYear: 1925,
  },
  {
    id: 'curated-15',
    title: "Shantaram",
    author: "Gregory David Roberts",
    coverUrl: "https://covers.openlibrary.org/b/id/8235222-L.jpg",
    summary: "An escaped Australian convict arrives in Bombay with a false passport, living in the slums, setting up a free medical clinic, and forging deep bonds in India.",
    suggestedGenres: ["Adventure", "Memoir & Fiction", "Indian Lit"],
    firstPublishYear: 2003,
  },
  {
    id: 'curated-16',
    title: "Ikigai: The Japanese Secret to a Long and Happy Life",
    author: "Héctor García & Francesc Miralles",
    coverUrl: "https://covers.openlibrary.org/b/id/10542387-L.jpg",
    summary: "Discover the Japanese concept of Ikigai - a reason for being - to bring meaning, health, and joy to your life every day.",
    suggestedGenres: ["Philosophy", "Self-Help & Psychology", "Mindfulness"],
    firstPublishYear: 2016,
  },
  {
    id: 'curated-17',
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverUrl: "https://covers.openlibrary.org/b/id/8231851-L.jpg",
    summary: "A romantic masterpiece following Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage in Regency England.",
    suggestedGenres: ["Classic Fiction", "Romance", "Social Satire"],
    firstPublishYear: 1813,
  },
  {
    id: 'curated-18',
    title: "Norwegian Wood",
    author: "Haruki Murakami",
    coverUrl: "https://covers.openlibrary.org/b/id/8233303-L.jpg",
    summary: "A nostalgic story of loss and burgeoning sexuality seen through the eyes of Toru Watanabe in 1960s Tokyo.",
    suggestedGenres: ["Contemporary Fiction", "Romance", "Coming of Age"],
    firstPublishYear: 1987,
  },
  {
    id: 'curated-19',
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    coverUrl: "https://covers.openlibrary.org/b/id/8231991-L.jpg",
    summary: "An unforgettable, heartbreaking story of the unlikely friendship between a wealthy boy and the son of his father's servant in Afghanistan.",
    suggestedGenres: ["Historical Fiction", "Drama", "Contemporary Fiction"],
    firstPublishYear: 2003,
  },
  {
    id: 'curated-20',
    title: "Katha Upanishad & Ancient Verse",
    author: "Eknath Easwaran",
    coverUrl: "https://covers.openlibrary.org/b/id/8235122-L.jpg",
    summary: "Timeless dialogues on immortality, self-realization, and wisdom from ancient Indian philosophical traditions.",
    suggestedGenres: ["Philosophy", "Mythological Fiction", "Spiritual & Vedic"],
    firstPublishYear: 1987,
  }
];

// Clean subjects from Open Library or Google Books into clean, human-friendly genres
export function normalizeSubjectsToGenres(subjects?: string[]): string[] {
  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return [];
  }

  const genreMap: { [pattern: string]: string } = {
    'science fiction': 'Science Fiction',
    'sci-fi': 'Science Fiction',
    'dystopi': 'Dystopian',
    'fantasy': 'Fantasy',
    'magic': 'Fantasy',
    'wizards': 'Fantasy',
    'mystery': 'Mystery & Thriller',
    'detective': 'Crime & Detective',
    'thriller': 'Mystery & Thriller',
    'suspense': 'Mystery & Thriller',
    'crime': 'Crime & Detective',
    'romance': 'Romance',
    'love': 'Romance',
    'historical fiction': 'Historical Fiction',
    'history': 'History & Culture',
    'philosophy': 'Philosophy',
    'philosophical': 'Philosophy',
    'self-help': 'Self-Help & Psychology',
    'self help': 'Self-Help & Psychology',
    'psychology': 'Self-Help & Psychology',
    'behavior': 'Self-Help & Psychology',
    'habits': 'Personal Growth',
    'business': 'Business & Economics',
    'economics': 'Business & Economics',
    'finance': 'Personal Finance',
    'biography': 'Biography & Memoir',
    'memoir': 'Biography & Memoir',
    'autobiography': 'Biography & Memoir',
    'poetry': 'Poetry',
    'poems': 'Poetry',
    'epic': 'Epic Drama',
    'drama': 'Drama',
    'play': 'Drama',
    'indian': 'Indian Lit',
    'india': 'Indian Lit',
    'mytholog': 'Mythological Fiction',
    'vedic': 'Spiritual & Vedic',
    'hindu': 'Spiritual & Vedic',
    'spiritual': 'Spirituality',
    'adventure': 'Adventure',
    'horror': 'Horror',
    'young adult': 'Young Adult',
    'juvenile': 'Young Adult',
    'satire': 'Satire',
    'humor': 'Humor & Comedy',
    'classic': 'Classic Fiction',
    'short stories': 'Anthology & Short Stories',
    'graphic novel': 'Comics & Graphic Novels',
    'comic': 'Comics & Graphic Novels',
    'travel': 'Travel & Memoir',
  };

  const detected = new Set<string>();

  for (const raw of subjects) {
    const s = String(raw).toLowerCase().trim();
    for (const [pattern, normalized] of Object.entries(genreMap)) {
      if (s.includes(pattern)) {
        detected.add(normalized);
      }
    }
  }

  // If no mapped patterns found, take top clean subjects
  if (detected.size === 0) {
    for (const raw of subjects.slice(0, 3)) {
      const clean = String(raw).trim();
      if (clean.length > 2 && clean.length < 30 && !clean.includes('(') && !clean.includes('=')) {
        detected.add(clean.charAt(0).toUpperCase() + clean.slice(1));
      }
    }
  }

  return Array.from(detected);
}

/**
 * Searches books by query with instantaneous local match + Open Library online search
 */
export async function searchBookSuggestions(query: string): Promise<BookSuggestion[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  // 1. Instant local matching
  const localMatches = CURATED_BOOKS.filter(
    b =>
      b.title.toLowerCase().includes(trimmed) ||
      b.author.toLowerCase().includes(trimmed) ||
      b.suggestedGenres.some(g => g.toLowerCase().includes(trimmed))
  );

  // 2. Fetch from Open Library Search API
  let onlineResults: BookSuggestion[] = [];
  try {
    const encoded = encodeURIComponent(query.trim());
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encoded}&fields=title,author_name,cover_i,subject,first_sentence,first_publish_year,key&limit=8`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.docs)) {
        onlineResults = data.docs
          .filter((doc: any) => Boolean(doc.title))
          .map((doc: any, index: number): BookSuggestion => {
            const rawSubjects = Array.isArray(doc.subject) ? doc.subject.slice(0, 10) : [];
            const normalizedGenres = normalizeSubjectsToGenres(rawSubjects);

            let coverUrl: string | null = null;
            if (doc.cover_i) {
              coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
            } else if (doc.cover_edition_key) {
              coverUrl = `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg`;
            } else if (Array.isArray(doc.isbn) && doc.isbn.length > 0) {
              coverUrl = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
            }

            const firstSentence = Array.isArray(doc.first_sentence)
              ? doc.first_sentence[0]
              : typeof doc.first_sentence === 'string'
              ? doc.first_sentence
              : '';

            return {
              id: `ol-${doc.key || index}-${doc.cover_i || index}`,
              title: doc.title,
              author: doc.author_name?.[0] || 'Unknown Author',
              coverUrl,
              summary: firstSentence || '',
              suggestedGenres: normalizedGenres,
              firstPublishYear: doc.first_publish_year,
              workKey: doc.key,
            };
          });
      }
    }
  } catch (err) {
    // If offline or request fails, gracefully fallback to local matches
  }

  // 3. Merge results, prioritize exact and local matches, and deduplicate by title + author
  const seen = new Set<string>();
  const combined: BookSuggestion[] = [];

  for (const item of [...localMatches, ...onlineResults]) {
    const key = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '')}_${item.author.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(item);
    }
  }

  // Sort: Title starts with query first, then includes query
  return combined.sort((a, b) => {
    const aStarts = a.title.toLowerCase().startsWith(trimmed);
    const bStarts = b.title.toLowerCase().startsWith(trimmed);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return 0;
  });
}

/**
 * Automatically fetch the original, real book cover given a title and author.
 */
export async function fetchOriginalCover(
  title: string,
  author?: string
): Promise<{
  coverUrl: string | null;
  summary?: string;
  genres?: string[];
  resolvedAuthor?: string;
  firstPublishYear?: number;
}> {
  const cleanTitle = (title || '').trim().toLowerCase();
  const cleanAuthor = (author || '').trim().toLowerCase();

  if (!cleanTitle || cleanTitle.length < 2) {
    return { coverUrl: null };
  }

  // 1. Check curated catalog for instant 0ms match
  const curated = CURATED_BOOKS.find(b => {
    const titleMatch =
      b.title.toLowerCase() === cleanTitle ||
      b.title.toLowerCase().includes(cleanTitle) ||
      cleanTitle.includes(b.title.toLowerCase());
    const authorMatch =
      !cleanAuthor ||
      b.author.toLowerCase().includes(cleanAuthor) ||
      cleanAuthor.includes(b.author.toLowerCase());
    return titleMatch && authorMatch;
  });

  if (curated && curated.coverUrl) {
    return {
      coverUrl: curated.coverUrl,
      summary: curated.summary,
      genres: curated.suggestedGenres,
      resolvedAuthor: curated.author,
      firstPublishYear: curated.firstPublishYear,
    };
  }

  // 2. Query Open Library by title & author specifically
  try {
    const query = cleanAuthor
      ? `title=${encodeURIComponent(title.trim())}&author=${encodeURIComponent(author!.trim())}`
      : `q=${encodeURIComponent(title.trim())}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(
      `https://openlibrary.org/search.json?${query}&fields=title,author_name,cover_i,cover_edition_key,isbn,subject,first_sentence,first_publish_year,key&limit=5`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.docs) && data.docs.length > 0) {
        for (const doc of data.docs) {
          let foundCover: string | null = null;
          if (doc.cover_i) {
            foundCover = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
          } else if (doc.cover_edition_key) {
            foundCover = `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg`;
          } else if (Array.isArray(doc.isbn) && doc.isbn.length > 0) {
            foundCover = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
          }

          if (foundCover) {
            const rawSubjects = Array.isArray(doc.subject) ? doc.subject.slice(0, 10) : [];
            const genres = normalizeSubjectsToGenres(rawSubjects);
            const firstSentence = Array.isArray(doc.first_sentence)
              ? doc.first_sentence[0]
              : typeof doc.first_sentence === 'string'
              ? doc.first_sentence
              : '';

            return {
              coverUrl: foundCover,
              summary: firstSentence || '',
              genres,
              resolvedAuthor: doc.author_name?.[0],
              firstPublishYear: doc.first_publish_year,
            };
          }
        }
      }
    }
  } catch (e) {}

  return { coverUrl: null };
}

/**
 * Optionally fetch full work description from Open Library if initial summary was brief
 */
export async function fetchFullDescription(workKey: string): Promise<string | null> {
  if (!workKey) return null;
  try {
    const key = workKey.startsWith('/') ? workKey : `/${workKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`https://openlibrary.org${key}.json`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (typeof data.description === 'string') {
        return data.description.trim();
      }
      if (data.description && typeof data.description.value === 'string') {
        return data.description.value.trim();
      }
    }
  } catch (e) {}
  return null;
}
