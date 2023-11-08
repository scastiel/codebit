/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Snippet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Snippet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Snippet" ADD COLUMN     "slug" TEXT;
UPDATE "Snippet" SET slug = array_to_string(array(select string_agg(substring('0123456789bcdfghjkmnpqrstvwxyz', round(random() * 30)::integer, 1), '')
                                    from generate_series(1, 6)
                                    where "Snippet".slug is distinct from 'something'
                                   ), '');
ALTER TABLE "Snippet" ALTER COLUMN "slug" SET NOT NULL;


-- CreateIndex
CREATE UNIQUE INDEX "Snippet_slug_key" ON "Snippet"("slug");
