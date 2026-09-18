import type { BusinessOpportunity, JobOpportunity } from "../types/opportunity";

export function filterJobs(jobs: JobOpportunity[], search: string, employment: string) {
  const query = search.trim().toLocaleLowerCase("id-ID");
  return jobs.filter(job => [job.title, job.company, job.location].some(value => value.toLocaleLowerCase("id-ID").includes(query)) && (employment === "Semua" || job.employmentType === employment));
}
export function filterBusinesses(businesses: BusinessOpportunity[], search: string, category: string) {
  const query = search.trim().toLocaleLowerCase("id-ID");
  return businesses.filter(business => [business.businessName, business.category, business.location, business.ownerName].some(value => value.toLocaleLowerCase("id-ID").includes(query)) && (category === "Semua" || business.category === category));
}
