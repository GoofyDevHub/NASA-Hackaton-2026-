"""Export the actual simulator's score twice, once per fresh page, without network."""
import hashlib
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SIM = HERE.parents[1] / 'confronto-simulatore' / 'simulatore.html'

def extract(browser):
    page = browser.new_page()
    page.route('https://**/*', lambda route: route.abort())
    page.goto(SIM.as_uri(), wait_until='load')
    page.wait_for_function('appState.synthResult !== null')
    page.locator('#durationSlider').fill('15')
    captures = {}
    for image in sorted((HERE/'immagini').glob('*.jpg')):
        page.locator('#fileInput').set_input_files(image)
        page.wait_for_function("name => appState.activeImageName===name && appState.synthResult.totalSamples===720000",arg=image.name)
        record=page.evaluate("""() => ({seed:appState.sha256Hex,
            score:appState.synthResult.eventTelemetry.map(e=>[e.carrierFreq,e.lSeg,e.cSeg,e.xSeg])})""")
        assert len(record['score']) == 180
        record['file_sha256']=hashlib.sha256(image.read_bytes()).hexdigest()
        captures[image.stem]=record
    page.close()
    return captures

if __name__ == '__main__':
    with sync_playwright() as p:
        browser=p.chromium.launch(channel='chrome', headless=True)
        scores=extract(browser)
        assert scores==extract(browser)
        browser.close()
    (HERE/'partiture.json').write_text(json.dumps(scores, separators=(',',':')),encoding='utf-8')
