import { QuestionsRepository } from '../repositories/questions-repository'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

type DeleteQuestionUseCaseResponse = void

export class DeleteQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found.')
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    await this.questionsRepository.delete(question)
  }
}
