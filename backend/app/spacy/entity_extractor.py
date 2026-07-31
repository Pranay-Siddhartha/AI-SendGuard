import spacy

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_entities(text: str) -> dict:
    """
    Use spaCy ONLY for generic Named Entity Recognition.
    Detects only PERSON, ORG, GPE (Locations), and DATE.
    """
    doc = nlp(text)
    
    entities = {
        "persons": [],
        "organizations": [],
        "locations": [],
        "dates": []
    }
    
    for ent in doc.ents:
        val = ent.text.strip()
        if not val:
            continue
            
        if ent.label_ == "PERSON" and val not in entities["persons"]:
            entities["persons"].append(val)
        elif ent.label_ == "ORG" and val not in entities["organizations"]:
            entities["organizations"].append(val)
        elif ent.label_ == "GPE" and val not in entities["locations"]:
            entities["locations"].append(val)
        elif ent.label_ == "DATE" and val not in entities["dates"]:
            entities["dates"].append(val)
            
    return entities
