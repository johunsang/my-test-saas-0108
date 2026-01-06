import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteParams = { params: Promise<{ id: string }> }

// GET - 특정 노트 조회
export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const note = await prisma.note.findUnique({
      where: { id },
    })

    if (!note) {
      return NextResponse.json({ error: '노트를 찾을 수 없습니다' }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error('노트 조회 실패:', error)
    return NextResponse.json({ error: '노트를 불러올 수 없습니다' }, { status: 500 })
  }
}

// PUT - 노트 수정
export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const { title, content, published } = await request.json()

    const note = await prisma.note.update({
      where: { id },
      data: { title, content, published },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('노트 수정 실패:', error)
    return NextResponse.json({ error: '노트를 수정할 수 없습니다' }, { status: 500 })
  }
}

// DELETE - 노트 삭제
export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    await prisma.note.delete({
      where: { id },
    })

    return NextResponse.json({ message: '노트가 삭제되었습니다' })
  } catch (error) {
    console.error('노트 삭제 실패:', error)
    return NextResponse.json({ error: '노트를 삭제할 수 없습니다' }, { status: 500 })
  }
}
