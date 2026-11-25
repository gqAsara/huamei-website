"""Reproducible geometry comparisons for the weekly consumer packaging column."""
from datetime import date
from math import prod

FIRST_ISSUE = date(2026, 11, 25)


def dimension(values):
    return " × ".join(f"{v:g}" for v in values)


def clearance(sizes):
    rows = []
    examples = []
    for size in sizes:
        original = prod(size)
        for gap in (0, 2.5, 5, 10):
            inside = [side + 2 * gap for side in size]
            capacity = prod(inside)
            change = 100 * (capacity / original - 1)
            rows.append([dimension(size), f"{gap:g}", dimension(inside), f"{capacity / 1000:,.1f}", f"{change:.1f}"])
            if gap == 5:
                examples.append(f"{dimension(size)} mm: {original / 1000:,.1f} to {capacity / 1000:,.1f} cm³ ({change:.1f}% more).")
    return (
        "How does extra clearance change the size of a gift box?",
        "Adding 5 mm on each of two opposite faces adds 10 mm to that axis. The same clearance takes up a larger share of a smaller box.",
        "How much volume does clearance add?",
        "Model three rectangular packed items at four clearances. Add the stated gap to each of the six faces. Multiply the resulting inside length, width and height in millimetres, then divide by 1,000 to get cubic centimetres. Each percentage uses that item's zero-clearance volume as its baseline.",
        ["Packed item L × W × H (mm)", "Gap per face (mm)", "Box inside L × W × H (mm)", "Inside volume (cm³)", "Increase (%)"],
        rows, examples,
        "These are calculated dimensions. A product resting on the base has a different distribution of space. The table does not establish how much cushioning a particular product needs in transit.",
    )


def shelf(sizes):
    shelf_width, shelf_depth = 800, 400
    rows = []
    findings = []
    for length, width, _ in sizes:
        counts = []
        for across, back in ((length, width), (width, length)):
            nx, ny = shelf_width // across, shelf_depth // back
            counts.append(nx * ny)
            rows.append([dimension((length, width)), dimension((across, back)), str(nx), str(ny), str(nx * ny)])
        findings.append(f"For a {length} × {width} mm base the two orientations hold {counts[0]} and {counts[1]} boxes per layer.")
    return ("How many gift boxes fit on a shelf?", "Measure the outside of an assembled box and count whole boxes in each direction. A quarter turn can change the count.",
            "One layer on an 800 × 400 mm shelf",
            "Divide the clear shelf width and depth by the corresponding box dimensions. Round each count down, multiply them and repeat with boxes turned 90 degrees.",
            ["Box base (mm)", "Across × back (mm)", "Across", "Deep", "Boxes per layer"], rows, findings,
            "The model uses one orientation per layer and no gaps. Mixed layouts, shelf lips, retrieval space and load limits can change what fits.")


def insert_depth(sizes):
    rows = []
    for _, _, depth in sizes:
        for base in (0, 5, 12):
            top = 3
            rows.append([str(depth), str(base), str(top), str(depth - base - top)])
    return ("How tall can a gift be after I add a box insert?", "Measure from the surface that supports the gift to the underside of the closed lid. A platform and a lid lining both take up height.",
            "Usable height above an insert",
            "For each inside depth, subtract the thickness below the gift and the 3 mm lid lining. The example assumes the gift sits on a level platform.",
            ["Inside depth (mm)", "Platform under gift (mm)", "Lid lining (mm)", "Available height (mm)"], rows,
            [f"In a {sizes[0][2]} mm deep box, a 12 mm platform and a 3 mm lining leave {sizes[0][2]-15} mm above the platform.",
             "Changing the platform from 5 to 12 mm removes another 7 mm of usable height in every row."],
            "A recessed or compressible insert has a different seating height. Measure where the actual product rests and allow for any cap or raised detail.")


def band(sizes):
    rows = []
    for _, width, height in sizes:
        for overlap in (10, 20, 30):
            rows.append([str(width), str(height), str(overlap), str(2 * (width + height) + overlap)])
    return ("How long should a paper sleeve be for a gift box?", "A sleeve around the width and height needs two widths, two heights and a joining overlap. Measure the outside of the closed box.",
            "Paper length around a closed box",
            "Calculate the strip length as 2 × (width + height) + overlap. Compare three example overlaps on each box, holding the wrapped orientation fixed.",
            ["Box width (mm)", "Box height (mm)", "Overlap (mm)", "Strip length (mm)"], rows,
            [f"A box {sizes[0][1]} mm wide and {sizes[0][2]} mm high uses {2*(sizes[0][1]+sizes[0][2])+20} mm of strip with a 20 mm overlap.",
             "Each extra 10 mm of overlap adds 10 mm of strip without changing the size of the sleeve opening."],
            "The arithmetic omits fold allowances and the thickness of the sleeve stock. Wrap a paper strip around the finished box before cutting a batch.")


def twins(sizes):
    rows = []
    for length, width, height in sizes:
        for gap in (0, 4, 10):
            rows.append([dimension((length,width,height)), str(gap), dimension((length, 2*width+gap, height)), dimension((2*length+gap, width, height))])
    return ("How much room do two gift boxes need in one mailer?", "Put the two closed boxes in the intended orientation and measure their combined footprint. A divider adds space on the axis between them.",
            "Packing two equal boxes with a divider",
            "Use identical rectangular boxes. Double the dimension along which the boxes sit together, add the stated divider thickness once, and keep the other two dimensions fixed.",
            ["One box outside (mm)", "Divider (mm)", "Side by side (mm)", "End to end (mm)"], rows,
            ["Moving the divider changes which inside dimension the mailer needs.",
             "A 4 mm divider adds 4 mm between the boxes. Padding at the outside walls is a separate allowance."],
            "These dimensions describe the two boxes and divider only. They exclude any outer cushioning and give no drop or compression rating.")


def walls(sizes):
    rows=[]
    for size in sizes:
        for thickness in (1, 2, 3):
            inside=[d-2*thickness for d in size]
            rows.append([dimension(size), str(thickness), dimension(inside), f"{prod(inside)/1000:,.1f}"])
    return ("How much smaller is a box on the inside?", "Where two opposite walls have the same thickness, subtract twice that thickness from the outside measurement. Check the finished box at its narrowest points.",
            "From outside dimensions to inside volume",
            "Treat each box as a rectangular shell with equal walls on all six faces. Subtract twice the wall thickness from each axis, then multiply the three inside dimensions.",
            ["Outside L × W × H (mm)", "Wall (mm)", "Modelled inside (mm)", "Inside volume (cm³)"], rows,
            ["Increasing wall thickness from 1 to 3 mm takes another 4 mm off each inside dimension.",
             "Liners and folded corners can reduce usable space further, even if the outside size is unchanged."],
            "Real boxes can have overlapping flaps, doubled sides or a lid of different thickness. The calculated interior is a comparison, not a substitute for measuring the box.")


def ribbon(sizes):
    rows=[]
    for length,width,height in sizes:
        for allowance in (0, 200, 300):
            rows.append([dimension((length,width,height)), str(allowance), str(2*length+2*width+4*height+allowance)])
    return ("How much ribbon do I need to cross-wrap a box?", "Measure a loop around the length and height and a second around the width and height. Add the ribbon your knot, bow and tails use.",
            "Ribbon length for two crossing loops",
            "Model two perpendicular loops around the outside faces. Their length is 2 × length + 2 × width + 4 × height. Compare three example tie allowances.",
            ["Box outside (mm)", "Tie allowance (mm)", "Total ribbon (mm)"], rows,
            [f"A {dimension(sizes[0])} mm box uses {2*sizes[0][0]+2*sizes[0][1]+4*sizes[0][2]} mm for the loops before tying.",
             "An extra 10 mm of box height adds 40 mm of ribbon across the two loops."],
            "A wide ribbon, crossover twist, bow style or diagonal wrap changes the cut length. Tie one sample using your ribbon to measure the allowance.")


def occupied(sizes):
    rows=[]
    for length,width,height in sizes:
        for top_gap in (5, 15, 30):
            boxvol=length*width*height
            itemvol=length*width*(height-top_gap)
            rows.append([dimension((length,width,height)),str(top_gap),f"{(boxvol-itemvol)/1000:,.1f}",f"{100*(boxvol-itemvol)/boxvol:.1f}"])
    return ("How much empty space is above a product in its box?", "For a flat-topped item that fills the base, multiply the inside length and width by the empty height above it.",
            "Calculating headspace below a flat lid",
            "Place a rectangular item against the base and assume it fills the footprint. Compare three gaps under the lid. Divide gap volume by inside box volume to calculate the empty share.",
            ["Inside box (mm)", "Top gap (mm)", "Gap volume (cm³)", "Box volume empty (%)"], rows,
            ["A 15 mm top gap has three times the volume of a 5 mm gap on the same footprint.",
             "For the same gap, a shallower box has a greater percentage of empty volume."],
            "Irregular products leave side gaps too. The calculation describes headspace only and does not determine the right amount of shipping protection.")


MODELS = (clearance, shelf, insert_depth, band, twins, walls, ribbon, occupied)
SIZE_SETS = (
    ((120, 80, 45), (200, 150, 80), (300, 220, 120)),
    ((100, 70, 40), (180, 120, 65), (280, 200, 110)),
    ((140, 100, 55), (220, 160, 90), (320, 240, 130)),
    ((160, 90, 50), (240, 180, 100), (350, 250, 150)),
)


def build_research(day):
    week = (day - FIRST_ISSUE).days // 7
    model = MODELS[week % len(MODELS)]
    series = week // len(MODELS)
    base_sizes = SIZE_SETS[series % len(SIZE_SETS)]
    # Subsequent comparisons use larger example packs. Five-mm increments
    # preserve the contrast across the three products and can be reproduced.
    step = 5 * (series // len(SIZE_SETS))
    sizes = tuple((length + step, width + step, height + step) for length, width, height in base_sizes)
    question, intro, title, method, columns, rows, findings, limitations = model(sizes)
    length, width, height = sizes[0]
    specific = {
        clearance: f"How much room does 5 mm of clearance add around a {dimension(sizes[0])} mm item?",
        shelf: f"How many {length} × {width} mm boxes fit across an 800 × 400 mm shelf?",
        insert_depth: f"How much height does a 12 mm insert leave in a {height} mm deep box?",
        band: f"How long should a paper sleeve be for a box {width} mm wide and {height} mm deep?",
        twins: f"How big a mailer fits two {dimension(sizes[0])} mm gift boxes?",
        walls: f"What fits inside a {dimension(sizes[0])} mm box with 2 mm walls?",
        ribbon: f"How much ribbon wraps a {dimension(sizes[0])} mm box in both directions?",
        occupied: f"How much space does a 15 mm top gap leave in a {dimension(sizes[0])} mm box?",
    }[model]
    return {
        "question": question, "specificQuestion": specific, "intro": intro, "answer": findings[0],
        "check": limitations,
        "study": {"title": title, "method": method, "columns": columns,
                  "rows": [{"cells": row} for row in rows], "findings": findings, "limitations": limitations},
    }
