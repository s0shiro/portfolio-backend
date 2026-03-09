import * as portfolioRepository from '../repositories/portfolio.repository.ts'

export async function fetchPortfolioProjects() {
  const projects = await portfolioRepository.getPublicProjects()
  return projects
}

export async function fetchPortfolioExperiences() {
  const experiences = await portfolioRepository.getPublicExperiences()
  return experiences
}
