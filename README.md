## Notes

### Generate supabase types

- generate a personal access token from supabase
  - can actually run `login` first which will redirect us to the supabase console and token creation
  - note down the app id (`rqavyroelmtspuxnybsz`) on the `/settings/general` page
  ```
      npx supabase login
      npx supabase gen types typescript --project-id "rqavyroelmtspuxnybsz" --schema public > app/shared/types/supabase.ts
  ```
