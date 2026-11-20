-- Rename template labels to genre-neutral names.
update public.templates
set name = 'Palace Heritage',
    description = 'A grand palace wedding card in deep maroon and gold. Features an ornate arch photo frame, velvet curtain opening, and traditional Indian motifs.'
where slug = 'royal-heritage';

update public.templates
set name = 'Neelam Blue',
    description = 'Midnight peacock blue and champagne gold. Inspired by Indian Sangeet nights, starlit courtyards, and deep blue silk.'
where slug = 'modern-minimal';
