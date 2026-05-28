import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib import rcParams

# Set font to support Chinese
rcParams['font.sans-serif'] = ['Arial Unicode MS', 'PingFang HK', 'Heiti TC', 'Microsoft YaHei', 'SimHei', 'sans-serif']
rcParams['axes.unicode_minus'] = False

def draw_rag_flowchart():
    # Create figure with high DPI for publication quality
    fig, ax = plt.subplots(figsize=(10, 14))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 14)
    ax.axis('off')

    # --- Style Configurations ---
    # Professional color palette (Muted/Scientific)
    colors = {
        'input': '#E1F5FE',    # Light Blue
        'data': '#FFF3E0',     # Light Orange
        'process': '#F5F5F5',  # Light Gray
        'algo': '#E8EAF6',     # Light Indigo
        'llm': '#E8F5E9',      # Light Green
        'border': '#37474F',   # Dark Slate
        'arrow': '#455A64'     # Dark Gray
    }
    
    # Box styles
    box_common = dict(boxstyle="round,pad=0.8,rounding_size=0.3", lw=1.5, ec=colors['border'])
    
    # Arrow styles
    arrow_common = dict(arrowstyle="-|>", lw=1.5, color=colors['arrow'], mutation_scale=20)

    # --- Nodes (Top to Bottom) ---

    # 1. Inputs
    # User Query
    ax.text(3, 12.5, "User Question\n(用户提问)", ha="center", va="center", size=12, weight='bold',
            bbox=dict(fc=colors['input'], **box_common))
    
    # Knowledge Base
    ax.text(7, 12.5, "Knowledge Base\n(知识库 JSON)", ha="center", va="center", size=12, weight='bold',
            bbox=dict(fc=colors['data'], **box_common))

    # 2. Retrieval System Container
    # Draw a large container for the retrieval logic
    # (x, y) is bottom-left corner for Rectangle, but FancyBboxPatch is simpler
    # Adjust coordinates for better centering
    rect_x, rect_y = 2.5, 8.5
    rect_w, rect_h = 5, 2.5
    rect = patches.FancyBboxPatch((rect_x, rect_y), rect_w, rect_h, 
                                  boxstyle="round,pad=0.2,rounding_size=0.2", 
                                  linewidth=1.5, edgecolor=colors['border'], 
                                  facecolor='white', linestyle="--")
    ax.add_patch(rect)
    ax.text(5, rect_y + rect_h + 0.3, "Retrieval System (检索系统)", ha="center", va="center", size=12, weight="bold")

    # Inside Retrieval: Algorithm
    ax.text(5, 10.2, "Weighted Keyword Scoring\n(关键词加权评分算法)", ha="center", va="center", size=11,
            bbox=dict(fc=colors['algo'], boxstyle="round,pad=0.5", ec=colors['border'], lw=1))
    
    # Inside Retrieval: Details
    details = (
        "• Title Match (+10)\n"
        "• Keyword Hit (+5)\n"
        "• Content Match (+3)\n"
        "• Metadata (+2)"
    )
    ax.text(5, 9.0, details, ha="center", va="center", size=10, family='monospace',
            bbox=dict(fc='white', ec='none', alpha=0))

    # 3. Context Builder
    ax.text(5, 7.0, "Context Construction\n(上下文构建)", ha="center", va="center", size=12,
            bbox=dict(fc=colors['process'], **box_common))

    # 4. Prompt Engineering
    ax.text(5, 5.0, "Prompt Engineering\n(提示词工程)", ha="center", va="center", size=12,
            bbox=dict(fc=colors['process'], **box_common))

    # 5. LLM
    ax.text(5, 3.0, "LLM Generation\n(DeepSeek/Gemini)", ha="center", va="center", size=12, weight='bold',
            bbox=dict(fc=colors['llm'], **box_common))

    # 6. Output
    ax.text(5, 1.0, "Final Response\n(最终回答)", ha="center", va="center", size=12, weight='bold',
            bbox=dict(fc=colors['input'], **box_common))


    # --- Arrows (Orthogonal / Standardized) ---

    def draw_arrow(start, end, connection="arc3", style="solid"):
        ax.annotate("", xy=end, xytext=start, 
                    arrowprops=dict(connectionstyle=connection, linestyle=style, **arrow_common))

    # User -> Retrieval (Simplified Connection)
    # Direct line with slight curve
    draw_arrow((3, 11.9), (4.5, 10.8), connection="arc3,rad=-0.1")
    
    # Knowledge -> Retrieval (Simplified Connection)
    # Direct line with slight curve
    draw_arrow((7, 11.9), (5.5, 10.8), connection="arc3,rad=0.1")

    # Retrieval Internal -> Context
    draw_arrow((5, 8.5), (5, 7.6), connection="arc3")

    # Context -> Prompt
    draw_arrow((5, 6.4), (5, 5.6), connection="arc3")

    # Prompt -> LLM
    draw_arrow((5, 4.4), (5, 3.6), connection="arc3")

    # LLM -> Output
    draw_arrow((5, 2.4), (5, 1.6), connection="arc3")

    # User Query Direct Link to Prompt (The "Side Channel")
    # Dashed line indicating the raw query is also part of the prompt
    
    # Draw a large curve on the left side
    ax.annotate("", xy=(3.8, 5.0), xytext=(3, 11.9), 
                arrowprops=dict(connectionstyle="arc3,rad=-0.5", 
                                arrowstyle="-|>", lw=1.5, color=colors['arrow'], ls="--"))
    
    # Label for the side channel - Horizontal text
    ax.text(1.5, 8.5, "Raw Query Injection\n(原始问题注入)", ha="center", va="center", size=10, 
            color=colors['border'], rotation=0, style='italic', bbox=dict(fc='white', ec='none'))

    plt.tight_layout()
    plt.savefig('rag_flowchart_v2.png', dpi=300, bbox_inches='tight')
    print("Flowchart saved as rag_flowchart_v2.png")

if __name__ == "__main__":
    draw_rag_flowchart()
