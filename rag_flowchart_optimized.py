import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.path import Path
from matplotlib import rcParams

# Set font to support Chinese
rcParams['font.sans-serif'] = ['Arial Unicode MS', 'PingFang HK', 'Heiti TC', 'Microsoft YaHei', 'SimHei', 'sans-serif']
rcParams['axes.unicode_minus'] = False

def draw_rag_flowchart():
    # Create figure
    fig, ax = plt.subplots(figsize=(12, 16))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 15)
    ax.axis('off')

    # --- Style Configurations ---
    colors = {
        'input': '#E1F5FE',    # Light Blue
        'data': '#FFF3E0',     # Light Orange
        'process': '#F5F5F5',  # Light Gray
        'algo': '#E8EAF6',     # Light Indigo
        'llm': '#E8F5E9',      # Light Green
        'border': '#37474F',   # Dark Slate
        'arrow': '#455A64'     # Dark Gray
    }
    
    box_common = dict(boxstyle="round,pad=0.8,rounding_size=0.3", lw=1.5, ec=colors['border'])
    
    # --- Helper to draw custom orthogonal arrows ---
    def draw_ortho_arrow(start, end, mid_x=None, mid_y=None, ls='-', color=colors['arrow']):
        """
        Draws an orthogonal arrow from start (x,y) to end (x,y).
        If mid_x is given, goes Horizontal to mid_x, then Vertical.
        If mid_y is given, goes Vertical to mid_y, then Horizontal.
        """
        verts = [start]
        codes = [Path.MOVETO]
        
        if mid_x is not None:
            # H -> V
            verts.append((mid_x, start[1]))
            codes.append(Path.LINETO)
            verts.append((mid_x, end[1]))
            codes.append(Path.LINETO)
            verts.append(end)
            codes.append(Path.LINETO)
        elif mid_y is not None:
            # V -> H -> V? No, usually V -> H for this graph
            # Start -> (start_x, mid_y) -> (end_x, mid_y) -> End
            verts.append((start[0], mid_y))
            codes.append(Path.LINETO)
            verts.append((end[0], mid_y))
            codes.append(Path.LINETO)
            verts.append(end)
            codes.append(Path.LINETO)
        else:
            # Direct L shape: V -> H
            verts.append((start[0], end[1]))
            codes.append(Path.LINETO)
            verts.append(end)
            codes.append(Path.LINETO)

        path = Path(verts, codes)
        patch = patches.PathPatch(path, facecolor='none', edgecolor=color, lw=1.5, ls=ls)
        ax.add_patch(patch)
        
        # Add arrow head at the end
        # We need to know the direction of the last segment to place the arrow correctly
        # But annotate handles direction if we give it points
        # Actually, pathpatch doesn't have an arrow head. We must add annotation at the end.
        
        # Calculate incoming vector for annotation
        dx = end[0] - verts[-2][0]
        dy = end[1] - verts[-2][1]
        
        # Use annotate with empty string to draw arrow head
        # shrinkB=0 ensures the arrow touches the end point exactly
        ax.annotate("", xy=end, xytext=verts[-2], 
                    arrowprops=dict(arrowstyle="-|>", lw=1.5, color=color, mutation_scale=20))

    # --- Nodes (Coordinates) ---
    # Central axis x=6
    
    # 1. Inputs
    # User Query (Left)
    ax.text(3, 13.5, "User Question\n(用户提问)", ha="center", va="center", size=12, weight='bold',
            bbox=dict(fc=colors['input'], **box_common))
    
    # Knowledge Base (Right)
    ax.text(9, 13.5, "Knowledge Base\n(知识库 JSON)", ha="center", va="center", size=12, weight='bold',
            bbox=dict(fc=colors['data'], **box_common))

    # 2. Retrieval System Container
    # Enclose the scoring mechanism
    rect_x, rect_y = 3, 9.0
    rect_w, rect_h = 6, 3.0
    rect = patches.FancyBboxPatch((rect_x, rect_y), rect_w, rect_h, 
                                  boxstyle="round,pad=0.2,rounding_size=0.2", 
                                  linewidth=1.5, edgecolor=colors['border'], 
                                  facecolor='white', linestyle="--")
    ax.add_patch(rect)
    ax.text(6, rect_y + rect_h + 0.3, "Retrieval System (检索系统)", ha="center", va="center", size=12, weight="bold")

    # Inside Retrieval: Algorithm
    ax.text(6, 11.0, "Weighted Keyword Scoring\n(关键词加权评分算法)", ha="center", va="center", size=11,
            bbox=dict(fc=colors['algo'], boxstyle="round,pad=0.5", ec=colors['border'], lw=1))
    
    # Inside Retrieval: Details
    details = (
        "• Title Match (+10)\n"
        "• Keyword Hit (+5)\n"
        "• Content Match (+3)\n"
        "• Metadata (+2)"
    )
    ax.text(6, 9.8, details, ha="center", va="center", size=10, family='monospace',
            bbox=dict(fc='white', ec='none', alpha=0))

    # 3. Context Builder
    ax.text(6, 7.5, "Context Construction\n(上下文构建)", ha="center", va="center", size=12,
            bbox=dict(fc=colors['process'], **box_common))

    # 4. Prompt Engineering
    ax.text(6, 5.5, "Prompt Engineering\n(提示词工程)", ha="center", va="center", size=12,
            bbox=dict(fc=colors['process'], **box_common))

    # 5. LLM
    ax.text(6, 3.5, "LLM Generation\n(DeepSeek/Gemini)", ha="center", va="center", size=12, weight='bold',
            bbox=dict(fc=colors['llm'], **box_common))

    # 6. Output
    ax.text(6, 1.5, "Final Response\n(最终回答)", ha="center", va="center", size=12, weight='bold',
            bbox=dict(fc=colors['input'], **box_common))


    # --- Arrows (Clean Routing) ---

    # 1. User -> Scoring
    # Down from User(3, 12.5 - h/2) -> y=11.5 -> Right to Scoring(6 - w/2, 11.5)
    # User box bottom is approx 12.9. Scoring top is approx 11.6.
    # We want to enter Scoring from the side or top?
    # Let's enter from the TOP of the scoring box.
    # User (3, 12.9) -> (3, 11.8) -> (5.5, 11.8) -> (5.5, 11.6)
    # Or just use the helper: V -> H -> V
    # Start: (3, 12.9). End: (5.5, 11.6). Mid_y: 12.2?
    
    # Actually, let's go into the SIDES of the scoring box to avoid text.
    # Scoring box center is (6, 11). Height ~1. Top ~11.5, Bottom ~10.5. Left ~4.5, Right ~7.5.
    
    # User(3, 12.9) -> Down to y=11 -> Right to x=4.5
    draw_ortho_arrow((3, 12.9), (4.5, 11.0), mid_y=11.0)

    # 2. Knowledge -> Scoring
    # Down from Knowledge(9, 12.9) -> y=11 -> Left to x=7.5
    draw_ortho_arrow((9, 12.9), (7.5, 11.0), mid_y=11.0)

    # 3. Scoring -> Context
    # Down from Scoring(6, 10.4ish) -> Context(6, 8.1)
    # Wait, scoring bottom is around 10.4?
    # Let's just draw straight down
    ax.annotate("", xy=(6, 8.1), xytext=(6, 9.0), 
                arrowprops=dict(arrowstyle="-|>", lw=1.5, color=colors['arrow'], mutation_scale=20))

    # 4. Context -> Prompt
    ax.annotate("", xy=(6, 6.1), xytext=(6, 6.9), 
                arrowprops=dict(arrowstyle="-|>", lw=1.5, color=colors['arrow'], mutation_scale=20))

    # 5. Prompt -> LLM
    ax.annotate("", xy=(6, 4.1), xytext=(6, 4.9), 
                arrowprops=dict(arrowstyle="-|>", lw=1.5, color=colors['arrow'], mutation_scale=20))

    # 6. LLM -> Output
    ax.annotate("", xy=(6, 2.1), xytext=(6, 2.9), 
                arrowprops=dict(arrowstyle="-|>", lw=1.5, color=colors['arrow'], mutation_scale=20))

    # 7. Raw Query Injection (Side Channel)
    # From Left of User(1.8, 13.5) -> Far Left(1.0) -> Down to y=5.5 -> Right to Prompt(4.8, 5.5)
    
    # Define points for the path
    start_point = (1.8, 13.5)
    end_point = (4.8, 5.5)
    corner_x = 0.8
    
    verts = [
        start_point,
        (corner_x, 13.5),  # Go Left
        (corner_x, 5.5),   # Go Down
        end_point          # Go Right
    ]
    codes = [Path.MOVETO, Path.LINETO, Path.LINETO, Path.LINETO]
    
    path = Path(verts, codes)
    patch = patches.PathPatch(path, facecolor='none', edgecolor=colors['arrow'], lw=1.5, ls='--')
    ax.add_patch(patch)
    
    # Arrow head
    ax.annotate("", xy=end_point, xytext=(corner_x, 5.5), 
                arrowprops=dict(arrowstyle="-|>", lw=1.5, color=colors['arrow'], mutation_scale=20))
    
    # Label on the side line
    ax.text(1.0, 9.5, "Raw Query Injection\n(原始问题注入)", ha="center", va="center", size=10, 
            color=colors['border'], rotation=90, style='italic', 
            bbox=dict(fc='white', ec='none', alpha=0.8))

    plt.tight_layout()
    plt.savefig('rag_flowchart_optimized.png', dpi=300, bbox_inches='tight')
    print("Flowchart saved as rag_flowchart_optimized.png")

if __name__ == "__main__":
    draw_rag_flowchart()
