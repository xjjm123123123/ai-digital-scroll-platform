import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.path import Path
from matplotlib import rcParams
import numpy as np

# Set font to support Chinese
rcParams['font.sans-serif'] = ['Arial Unicode MS', 'PingFang HK', 'Heiti TC', 'Microsoft YaHei', 'SimHei', 'sans-serif']
rcParams['axes.unicode_minus'] = False
# Enable mathtext for formulas
rcParams['mathtext.fontset'] = 'cm'

def draw_academic_rag_flowchart():
    # Create figure with high DPI and scientific proportions
    fig, ax = plt.subplots(figsize=(12, 16))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 16)
    ax.axis('off')

    # --- Style Configurations (Academic/Professional) ---
    colors = {
        'input': '#E3F2FD',      # Blue-50 (Data Sources)
        'preprocess': '#FFF3E0', # Orange-50 (Indexing)
        'retrieval': '#F3E5F5',  # Purple-50 (Core Logic)
        'generation': '#E8F5E9', # Green-50 (LLM)
        'output': '#E3F2FD',     # Blue-50
        'border': '#455A64',     # Blue Grey-700
        'text': '#263238',       # Blue Grey-900
        'accent': '#1565C0'      # Blue-800
    }
    
    # Standard Box Style
    def get_box_style(fc, ec=colors['border'], pad=0.6):
        return dict(boxstyle=f"round,pad={pad},rounding_size=0.2", lw=1.5, fc=fc, ec=ec)

    # --- Nodes Definition ---

    # 1. Input Layer
    # User Query
    ax.text(2.5, 14.5, "User Query\n(用户提问)", ha="center", va="center", size=11, weight='bold',
            color=colors['text'], bbox=get_box_style(colors['input']))
    
    # External Knowledge Corpus
    ax.text(9.5, 14.5, "External Knowledge Corpus\n(外部知识语料库)", ha="center", va="center", size=11, weight='bold',
            color=colors['text'], bbox=get_box_style(colors['input']))

    # 1.5 Preprocessing / Indexing (New Module)
    # Between Corpus and Retrieval
    # Shift down slightly
    ax.text(9.5, 12.8, "Indexing Pipeline\n(分块与索引)", ha="center", va="center", size=10,
            color=colors['text'], bbox=get_box_style(colors['preprocess'], pad=0.4))

    # 2. Retrieval System (The Core)
    # Large container
    # Move up slightly to close gap
    rect_x, rect_y = 3.5, 8.5
    rect_w, rect_h = 5.0, 3.5
    rect = patches.FancyBboxPatch((rect_x, rect_y), rect_w, rect_h, 
                                  boxstyle="round,pad=0.2,rounding_size=0.3", 
                                  linewidth=2.0, edgecolor='#9C27B0', # Purple border
                                  facecolor='white', linestyle="--", alpha=0.8)
    ax.add_patch(rect)
    ax.text(6.0, 11.7, "Heuristic Retrieval System (启发式检索系统)", ha="center", va="center", size=11, weight='bold', color='#6A1B9A')

    # Internal Logic: Strategy Box
    ax.text(6.0, 10.8, "Lexical Matching Strategy\n(BM25-based Scoring)", ha="center", va="center", size=10,
            bbox=get_box_style(colors['retrieval'], ec='#9C27B0', pad=0.4))
    
    # Internal Logic: Formula
    ax.text(6.0, 9.8, r"$Score = \sum_{i} w_i \cdot match_i$", ha="center", va="center", size=14, color='black')
    
    # Internal Logic: Weights (Pill shapes)
    weight_style = dict(boxstyle="round,pad=0.3,rounding_size=1", fc="#F5F5F5", ec="#BDBDBD", lw=1)
    ax.text(4.2, 9.0, r"$w_{title}=10$", ha="center", va="center", size=9, bbox=weight_style)
    ax.text(6.0, 9.0, r"$w_{key}=5$", ha="center", va="center", size=9, bbox=weight_style)
    ax.text(7.8, 9.0, r"$w_{tag}=2$", ha="center", va="center", size=9, bbox=weight_style)

    # 3. Contextual Augmentation
    ax.text(6.0, 7.0, "Contextual Augmentation\n(上下文增强)", ha="center", va="center", size=11,
            bbox=get_box_style(colors['generation']))

    # 4. Prompt Engineering (Funnel Shape)
    # Draw a trapezoid to represent "Prompt Engineering / Fusion"
    # Top width: 4, Bottom width: 2, Height: 1.5, Center: (6, 5.0)
    trap_top_y = 5.8
    trap_bot_y = 4.6
    trap_verts = [
        (4.0, trap_top_y), # Top Left
        (8.0, trap_top_y), # Top Right
        (7.0, trap_bot_y), # Bottom Right
        (5.0, trap_bot_y), # Bottom Left
    ]
    # Need polygon patch
    poly = patches.Polygon(trap_verts, closed=True, fc=colors['generation'], ec=colors['border'], lw=1.5)
    ax.add_patch(poly)
    ax.text(6.0, 5.2, "Prompt Fusion\n(提示词融合)", ha="center", va="center", size=10)

    # 5. Inference Engine
    ax.text(6.0, 3.2, "Inference Engine\n(Foundation Model)", ha="center", va="center", size=11, weight='bold',
            bbox=get_box_style(colors['generation']))

    # 6. Output
    ax.text(6.0, 1.5, "Final Response\n(最终回答)", ha="center", va="center", size=11, weight='bold',
            bbox=get_box_style(colors['output']))


    # --- Connections (Arrows) ---
    def draw_arrow(start, end, style="arc3,rad=0", ls="-"):
        ax.annotate("", xy=end, xytext=start, 
                    arrowprops=dict(connectionstyle=style, arrowstyle="-|>", lw=1.5, color=colors['border'], mutation_scale=15, ls=ls, shrinkA=0, shrinkB=0))

    # 1. User -> Retrieval (Orthogonal-ish)
    # From User Bottom (2.5, 14.0) to Retrieval Top-Left (4.5, 12.0)
    # Using arc3 instead of angle to be safe
    draw_arrow((2.5, 14.0), (4.5, 12.0), "arc3,rad=0.1")

    # 2. Corpus -> Indexing -> Retrieval
    # Corpus Bottom (9.5, 14.0) -> Indexing Top (9.5, 13.2)
    draw_arrow((9.5, 14.0), (9.5, 13.2), "arc3")
    # Indexing Bottom (9.5, 12.4) -> Retrieval Top-Right (7.5, 12.0)
    # Using arc3 instead of angle
    draw_arrow((9.5, 12.4), (7.5, 12.0), "arc3,rad=-0.1")

    # 3. Retrieval -> Context
    # Retrieval Bottom (6.0, 8.5) -> Context Top (6.0, 7.5)
    draw_arrow((6.0, 8.5), (6.0, 7.5), "arc3")

    # 4. Context -> Prompt (Funnel Top)
    # Context Bottom (6.0, 6.5) -> Funnel Top (6.0, 5.8)
    draw_arrow((6.0, 6.5), (6.0, 5.8), "arc3")

    # 5. Raw Query Injection (Curve)
    # User Query -> Prompt Engineering (Side input)
    # Curve from (2.5, 14.0) to Funnel Side (4.5, 5.2)
    # Use dashed line for "injection"
    ax.annotate("", xy=(4.5, 5.2), xytext=(2.5, 14.0), 
                arrowprops=dict(connectionstyle="arc3,rad=-0.2", 
                                arrowstyle="-|>", lw=1.5, color=colors['accent'], ls="--", shrinkA=0, shrinkB=0))
    
    # Label for injection
    ax.text(3.0, 9.5, "Raw Query Injection", ha="center", va="center", size=10, 
            color=colors['accent'], rotation=78, style='italic', bbox=dict(fc='white', ec='none', alpha=0.8))

    # 6. Prompt (Funnel Bottom) -> Inference
    # Funnel Bottom (6.0, 4.6) -> Inference Top (6.0, 3.7)
    draw_arrow((6.0, 4.6), (6.0, 3.7))

    # 7. Inference -> Output
    # Inference Bottom (6.0, 2.7) -> Output Top (6.0, 2.0)
    draw_arrow((6.0, 2.7), (6.0, 2.0))

    # Add Title
    plt.title("Figure 1: Architecture of the Heuristic RAG System", fontsize=14, y=0.98, pad=10)

    plt.tight_layout()
    plt.savefig('rag_architecture_academic.png', dpi=300, bbox_inches='tight')
    plt.savefig('rag_architecture_academic.pdf', bbox_inches='tight') # Also save PDF for vector graphics
    print("Flowchart saved as rag_architecture_academic.png and .pdf")

if __name__ == "__main__":
    draw_academic_rag_flowchart()
