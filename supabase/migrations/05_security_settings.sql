-- SQL triggers for automated gamification score & progress updates

-- 1. Book Addition Trigger: When a user lists a book on their shelf, automatically increase their profile's reading_score by +10.
create or replace function public.handle_book_added()
returns trigger as $$
begin
  update public.profiles
  set reading_score = reading_score + 10
  where id = new.owner_id;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_book_added
  after insert on public.books
  for each row execute procedure public.handle_book_added();


-- 2. Reading Note Spotlight Trigger: When a user publishes a story/spotlight, automatically increase their profile's reading_score by +15.
create or replace function public.handle_story_added()
returns trigger as $$
begin
  update public.profiles
  set reading_score = reading_score + 15
  where id = new.profile_id;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_story_added
  after insert on public.reading_stories
  for each row execute procedure public.handle_story_added();


-- 3. Swap Completion Trigger: When a swap message's exchange_status is updated to 'Completed', automatically increase their profile's reading_score by +20 and increment monthly_progress by 1 (not exceeding monthly_goal).
create or replace function public.handle_exchange_completed()
returns trigger as $$
declare
  conv_user1 uuid;
  conv_user2 uuid;
begin
  if (new.is_exchange_card = true and new.exchange_status = 'Completed' and (old.exchange_status is null or old.exchange_status != 'Completed')) then
    -- Get user1 and user2 from the conversation
    select user1_id, user2_id into conv_user1, conv_user2
    from public.conversations
    where id = new.conversation_id;

    -- Update both participants
    update public.profiles
    set 
      reading_score = reading_score + 20,
      monthly_progress = least(monthly_progress + 1, monthly_goal)
    where id in (conv_user1, conv_user2);
  end if;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_exchange_completed
  after update on public.messages
  for each row execute procedure public.handle_exchange_completed();
