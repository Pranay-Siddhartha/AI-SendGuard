from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..core import database
from ..core.orchestrator import process_file

router = APIRouter()

@router.post("", response_model=schemas.AnalysisDetailResponse)
async def analyze_file(
    file: UploadFile = File(...),
    sender: str = Form(...),
    recipient_email: str = Form(...),
    recipient_type: str = Form("single"),
    db: Session = Depends(database.get_db)
):
    contents = await file.read()
    analysis = process_file(
        db=db,
        file_bytes=contents,
        filename=file.filename,
        sender=sender,
        recipient_email=recipient_email,
        recipient_type=recipient_type
    )
    
    if analysis.status == "failed":
        raise HTTPException(status_code=500, detail="Analysis failed")
        
    return analysis

@router.get("/{id}", response_model=schemas.AnalysisDetailResponse)
def get_analysis(id: int, db: Session = Depends(database.get_db)):
    analysis = db.query(models.Analysis).filter(models.Analysis.id == id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis
