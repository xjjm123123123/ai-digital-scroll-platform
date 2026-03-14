import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib import rcParams

# Set font to support Chinese
rcParams['font.sans-serif'] = ['Arial Unicode MS', 'PingFang HK', 'Heiti TC', 'Microsoft YaHei', 'SimHei', 'sans-serif']
rcParams['axes.unicode_minus'] = False
rcParams['mathtext.fontset'] = 'cm'

def draw_academic_rag_flowchart_v2():
    # Create figure
    fig, ax = plt.subplots(figsize=(12, 16))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 16)
    ax.axis('off')

    colors = {
        'input': '#E3F2FD',      
        'preprocess': '#FFF3E0', 
        'retrieval': '#F3E5F5',  
        'generation': '#E8F5E9', 
        'output': '#E3F2FD',     
        'border': '#455A64',     
        'text': '#263238',       
        'accent': '#1565C0'      
    }

    # Helper to draw a box and text, returning the exact boundary (x, y, w, h)
    def draw_node(x, y, w, h, text, color, ec=colors['border'], fontsize=11, bold=False):
        # Draw box
        box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0,rounding_size=0.2", 
                                     fc=color, ec=ec, lw=1.5, mutation_scale=1) # pad=0 means exact size
        ax.add_patch(box)
        # Draw text
        fontweight = 'bold' if bold else 'normal'
        ax.text(x + w/2, y + h/2, text, ha="center", va="center", size=fontsize, 
                weight=fontweight, color=colors['text'])
        return (x, y, w, h)

    # --- 1. Nodes with Explicit Coordinates ---
    
    # User Query: Center (2.5, 14.5) -> Let's make it w=3, h=1
    # x=1.0, y=14.0
    user_box = draw_node(1.0, 14.0, 3.0, 1.0, "User Query\n(用户提问)", colors['input'], bold=True)
    
    # Corpus: Center (9.5, 14.5) -> w=3.4, h=1
    # x=7.8, y=14.0
    corpus_box = draw_node(7.8, 14.0, 3.4, 1.0, "External Knowledge Corpus\n(外部知识语料库)", colors['input'], bold=True)
    
    # Indexing: Center (9.5, 12.8) -> w=2.4, h=1
    # x=8.3, y=12.3
    idx_box = draw_node(8.3, 12.3, 2.4, 1.0, "Indexing Pipeline\n(分块与索引)", colors['preprocess'], fontsize=10)
    
    # Retrieval System Container: Explicit Patch
    # x=3.5, y=8.5, w=5.0, h=3.5
    retrieval_rect = patches.FancyBboxPatch((3.5, 8.5), 5.0, 3.5, 
                                  boxstyle="round,pad=0,rounding_size=0.3", 
                                  linewidth=2.0, edgecolor='#9C27B0', 
                                  facecolor='white', linestyle="--", alpha=0.8)
    ax.add_patch(retrieval_rect)
    # Retrieval Title
    ax.text(6.0, 11.7, "Heuristic Retrieval System (启发式检索系统)", ha="center", va="center", size=11, weight='bold', color='#6A1B9A')
    
    # Inner Retrieval Logic Box
    # Center (6.0, 10.8). w=3.0, h=0.8
    # x=4.5, y=10.4
    strat_box = draw_node(4.5, 10.4, 3.0, 0.8, "Lexical Matching Strategy\n(BM25-based Scoring)", 
                          colors['retrieval'], ec='#9C27B0', fontsize=10)
    
    # Formula
    ax.text(6.0, 9.6, r"$Score = \sum_{i} w_i \cdot match_i$", ha="center", va="center", size=14, color='black')
    
    # Pills
    def draw_pill(cx, cy, text):
        w, h = 1.2, 0.5
        draw_node(cx-w/2, cy-h/2, w, h, text, "#F5F5F5", ec="#BDBDBD", fontsize=9)
    draw_pill(4.2, 9.0, r"$w_{title}=10$")
    draw_pill(6.0, 9.0, r"$w_{key}=5$")
    draw_pill(7.8, 9.0, r"$w_{tag}=2$")

    # Contextual Augmentation
    # Center (6.0, 7.0). w=3.0, h=1.0
    # x=4.5, y=6.5
    ctx_box = draw_node(4.5, 6.5, 3.0, 1.0, "Contextual Augmentation\n(上下文增强)", colors['generation'])
    
    # Prompt Fusion (Trapezoid)
    # Top y=5.8, Bottom y=4.6
    # Top width 4.0 (4 to 8). Bottom width 2.0 (5 to 7)
    trap_verts = [(4.0, 5.8), (8.0, 5.8), (7.0, 4.6), (5.0, 4.6)]
    trap_poly = patches.Polygon(trap_verts, closed=True, fc=colors['generation'], ec=colors['border'], lw=1.5)
    ax.add_patch(trap_poly)
    ax.text(6.0, 5.2, "Prompt Fusion\n(提示词融合)", ha="center", va="center", size=10)
    
    # Inference Engine
    # Center (6.0, 3.2). w=3.0, h=1.0
    # x=4.5, y=2.7
    inf_box = draw_node(4.5, 2.7, 3.0, 1.0, "Inference Engine\n(Foundation Model)", colors['generation'], bold=True)
    
    # Output
    # Center (6.0, 1.5). w=2.4, h=1.0
    # x=4.8, y=1.0
    out_box = draw_node(4.8, 1.0, 2.4, 1.0, "Final Response\n(最终回答)", colors['output'], bold=True)


    # --- 2. Arrows with Exact Coordinates ---
    
    # Common arrow props
    arrow_args = dict(arrowstyle="-|>", lw=1.5, mutation_scale=15)

    def arrow(start, end, style="arc3,rad=0", ls="-", color=colors['border']):
        ax.annotate("", xy=end, xytext=start, 
                    arrowprops=dict(connectionstyle=style, linestyle=ls, color=color, **arrow_args))

    # 1. User (Bottom Center) -> Retrieval (Top Left area)
    # User Bottom: (2.5, 14.0)
    # Retrieval Top Edge: y=12.0. Target x=4.5
    arrow((2.5, 14.0), (4.5, 12.0), style="arc3,rad=0.1")

    # 2. Corpus (Bottom Center) -> Indexing (Top Center)
    # Corpus Bottom: (9.5, 14.0)
    # Indexing Top: (9.5, 13.3)
    arrow((9.5, 14.0), (9.5, 13.3), style="arc3,rad=0")

    # 3. Indexing (Bottom Center) -> Retrieval (Top Right area)
    # Indexing Bottom: (9.5, 12.3)
    # Retrieval Top Edge: y=12.0. Target x=7.5
    arrow((9.5, 12.3), (7.5, 12.0), style="arc3,rad=-0.1")

    # 4. Retrieval (Bottom Center) -> Context (Top Center)
    # Retrieval Bottom: (6.0, 8.5)
    # Context Top: (6.0, 7.5)
    arrow((6.0, 8.5), (6.0, 7.5), style="arc3,rad=0")

    # 5. Context (Bottom Center) -> Prompt (Top Center)
    # Context Bottom: (6.0, 6.5)
    # Prompt Top: (6.0, 5.8)
    arrow((6.0, 6.5), (6.0, 5.8), style="arc3,rad=0")

    # 6. Raw Query Injection
    # User Bottom (Shifted Left): (2.0, 14.0)
    # Prompt Side (Left Edge): At y=5.2, x on line from (4,5.8) to (5,4.6) is roughly 4.5
    # Let's target exactly (4.5, 5.2)
    arrow((2.0, 14.0), (4.5, 5.2), style="arc3,rad=-0.2", ls="--", color=colors['accent'])
    
    # Label
    ax.text(2.8, 9.5, "Raw Query Injection", ha="center", va="center", size=10, 
            color=colors['accent'], rotation=78, style='italic', bbox=dict(fc='white', ec='none', alpha=0.8))

    # 7. Prompt (Bottom Center) -> Inference (Top Center)
    # Prompt Bottom: (6.0, 4.6)
    # Inference Top: (6.0, 3.7)
    arrow((6.0, 4.6), (6.0, 3.7), style="arc3,rad=0")

    # 8. Inference (Bottom Center) -> Output (Top Center)
    # Inference Bottom: (6.0, 2.7)
    # Output Top: (6.0, 2.0)
    arrow((6.0, 2.7), (6.0, 2.0), style="arc3,rad=0")

    # Title
    plt.title("Figure 1: Architecture of the Heuristic RAG System", fontsize=14, y=0.98, pad=10)
    
    plt.tight_layout()
    plt.savefig('rag_architecture_academic_v2.png', dpi=300, bbox_inches='tight')
    plt.savefig('rag_architecture_academic_v2.pdf', bbox_inches='tight')
    print("Flowchart saved as rag_architecture_academic_v2.png")

if __name__ == "__main__":
    draw_academic_rag_flowchart_v2()
