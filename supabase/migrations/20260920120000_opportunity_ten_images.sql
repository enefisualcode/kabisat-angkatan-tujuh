-- Allow the existing multi-image upload flow to support ten photos per submission.
alter table public.opportunity_images drop constraint if exists opportunity_images_sort_order_check;
alter table public.opportunity_images add constraint opportunity_images_sort_order_check check (sort_order between 0 and 9);

alter table public.opportunity_upload_sessions drop constraint if exists opportunity_upload_sessions_image_paths_check;
alter table public.opportunity_upload_sessions add constraint opportunity_upload_sessions_image_paths_check check (cardinality(image_paths) between 0 and 10);
