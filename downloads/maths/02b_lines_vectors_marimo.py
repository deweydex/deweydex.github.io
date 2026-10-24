import marimo

__generated_with = "0.10.0"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import numpy as np
    import matplotlib.pyplot as plt
    return mo, np, plt


@app.cell
def _(mo):
    mo.md(
        r"""
        # Worksheet 2B: Linear Thinking — Data & Curves

        ---

        > **What This Worksheet Is About**
        > 
        > In the real world, data is messy. Lines don't pass through every point perfectly. But we can still ask: "Does this data have a linear trend?" and "What's the slope telling us?"
        > 
        > We'll also look at curves and ask: "At this particular spot, what would a line look like?" This is the beginning of calculus thinking — but don't worry, no calculus required yet.

        ---
        """
    )
    return


@app.cell
def _(mo):
    mo.md(
        r"""
        ## Part A: Which Dataset Is Most Linear?

        Below are three datasets showing the relationship between "Hours Studied" and "Exam Score". 
        Use the interactive controls to explore each dataset and decide which is best represented by a linear model.
        """
    )
    return


@app.cell
def _(mo, np, plt):
    # Dataset A - Linear
    hours = np.array([1, 2, 3, 4, 5, 6, 7, 8])
    scores_a = np.array([45, 52, 58, 61, 67, 73, 78, 84])
    scores_b = np.array([50, 55, 70, 60, 85, 65, 90, 75])  # Scattered
    scores_c = np.array([40, 45, 55, 70, 82, 88, 92, 94])  # Curved (diminishing returns)

    fig1, axes1 = plt.subplots(1, 3, figsize=(14, 4))

    axes1[0].scatter(hours, scores_a, c='steelblue', s=80)
    axes1[0].set_xlabel('Hours Studied')
    axes1[0].set_ylabel('Exam Score')
    axes1[0].set_title('Dataset A')
    axes1[0].set_xlim(0, 9)
    axes1[0].set_ylim(30, 100)
    axes1[0].grid(True, alpha=0.3)

    axes1[1].scatter(hours, scores_b, c='coral', s=80)
    axes1[1].set_xlabel('Hours Studied')
    axes1[1].set_ylabel('Exam Score')
    axes1[1].set_title('Dataset B')
    axes1[1].set_xlim(0, 9)
    axes1[1].set_ylim(30, 100)
    axes1[1].grid(True, alpha=0.3)

    axes1[2].scatter(hours, scores_c, c='seagreen', s=80)
    axes1[2].set_xlabel('Hours Studied')
    axes1[2].set_ylabel('Exam Score')
    axes1[2].set_title('Dataset C')
    axes1[2].set_xlim(0, 9)
    axes1[2].set_ylim(30, 100)
    axes1[2].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.gca()
    return axes1, fig1, hours, scores_a, scores_b, scores_c


@app.cell
def _(mo):
    dataset_choice = mo.ui.dropdown(
        options=["Dataset A", "Dataset B", "Dataset C"],
        value="Dataset A",
        label="Which dataset is most linear?"
    )
    dataset_choice
    return (dataset_choice,)


@app.cell
def _(dataset_choice, mo):
    _feedback = {
        "Dataset A": "✅ **Correct!** Dataset A shows a consistent linear pattern — each additional hour of studying adds roughly the same number of points.",
        "Dataset B": "❌ Dataset B is scattered with no clear pattern. The points jump around randomly.",
        "Dataset C": "❌ Dataset C shows a curve — notice how the gains flatten out at higher hours (diminishing returns)."
    }
    mo.md(_feedback[dataset_choice.value])
    return


@app.cell
def _(mo):
    mo.md(
        r"""
        ### Try Fitting a Line to Dataset A

        Use the sliders below to adjust the slope and intercept of a line. Try to make it fit Dataset A as closely as possible.
        """
    )
    return


@app.cell
def _(mo):
    slope_a = mo.ui.slider(start=0, stop=10, step=0.5, value=5, label="Slope (m)")
    intercept_a = mo.ui.slider(start=30, stop=60, step=1, value=40, label="Y-intercept (b)")
    mo.hstack([slope_a, intercept_a])
    return intercept_a, slope_a


@app.cell
def _(hours, intercept_a, np, plt, scores_a, slope_a):
    fig2, ax2 = plt.subplots(figsize=(8, 5))
    ax2.scatter(hours, scores_a, c='steelblue', s=80, label='Data', zorder=5)

    x_line = np.linspace(0, 9, 100)
    y_line = slope_a.value * x_line + intercept_a.value
    ax2.plot(x_line, y_line, 'r-', linewidth=2, label=f'y = {slope_a.value}x + {intercept_a.value}')

    # Calculate residuals
    predicted = slope_a.value * hours + intercept_a.value
    residuals = scores_a - predicted
    sse = np.sum(residuals**2)

    ax2.set_xlabel('Hours Studied')
    ax2.set_ylabel('Exam Score')
    ax2.set_title(f'Dataset A with Your Line (Sum of Squared Errors: {sse:.1f})')
    ax2.set_xlim(0, 9)
    ax2.set_ylim(30, 100)
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    plt.gca()
    return ax2, fig2, predicted, residuals, sse, x_line, y_line


@app.cell
def _(mo):
    mo.md(
        r"""
        **Question 1:** What slope and intercept give you the smallest Sum of Squared Errors?

        **Question 2:** What does the slope mean in this context? (Points gained per hour of study)
        """
    )
    return


@app.cell
def _(mo):
    mo.md(
        r"""
        ---

        ## Part B: Positive, Negative, or Zero Slope?

        Adjust the slope slider and observe how the line changes. Then answer the questions below.
        """
    )
    return


@app.cell
def _(mo):
    slope_demo = mo.ui.slider(start=-3, stop=3, step=0.25, value=1, label="Slope")
    slope_demo
    return (slope_demo,)


@app.cell
def _(np, plt, slope_demo):
    fig3, ax3 = plt.subplots(figsize=(8, 5))

    x_demo = np.linspace(-5, 5, 100)
    y_demo = slope_demo.value * x_demo

    ax3.plot(x_demo, y_demo, 'b-', linewidth=2)
    ax3.axhline(y=0, color='k', linewidth=0.5)
    ax3.axvline(x=0, color='k', linewidth=0.5)
    ax3.set_xlim(-5, 5)
    ax3.set_ylim(-8, 8)
    ax3.set_xlabel('x')
    ax3.set_ylabel('y')

    if slope_demo.value > 0:
        desc = "POSITIVE slope — line goes UP from left to right ↗"
    elif slope_demo.value < 0:
        desc = "NEGATIVE slope — line goes DOWN from left to right ↘"
    else:
        desc = "ZERO slope — line is HORIZONTAL →"

    ax3.set_title(f'Slope = {slope_demo.value}: {desc}')
    ax3.grid(True, alpha=0.3)
    plt.gca()
    return ax3, desc, fig3, x_demo, y_demo


@app.cell
def _(mo):
    mo.md(
        r"""
        **Match each scenario to expected slope type:**

        | Scenario | Positive / Negative / Zero? |
        |----------|----------------------------|
        | Price ↑ vs Quantity Demanded | |
        | Experience ↑ vs Salary | |
        | Distance Driven ↑ vs Fuel Remaining | |
        | Shoe Size vs Intelligence | |
        """
    )
    return


@app.cell
def _(mo):
    mo.md(
        r"""
        ---

        ## Part C: Eyeballing the Line of Best Fit

        Here's a scatter plot. Use the sliders to find the line of best fit by minimizing the residuals (shown as vertical lines from each point to your line).
        """
    )
    return


@app.cell
def _(mo):
    fit_slope = mo.ui.slider(start=0, stop=2, step=0.05, value=1, label="Slope")
    fit_intercept = mo.ui.slider(start=0, stop=3, step=0.1, value=1, label="Intercept")
    show_residuals = mo.ui.checkbox(value=True, label="Show residuals")
    mo.hstack([fit_slope, fit_intercept, show_residuals])
    return fit_intercept, fit_slope, show_residuals


@app.cell
def _(fit_intercept, fit_slope, np, plt, show_residuals):
    # Sample data
    x_data = np.array([1, 2, 3, 4, 5, 6, 7])
    y_data = np.array([2, 3, 5, 4, 6, 7, 8])

    fig4, ax4 = plt.subplots(figsize=(8, 6))

    # Plot line
    x_fit = np.linspace(0, 8, 100)
    y_fit = fit_slope.value * x_fit + fit_intercept.value
    ax4.plot(x_fit, y_fit, 'r-', linewidth=2, label=f'y = {fit_slope.value:.2f}x + {fit_intercept.value:.1f}')

    # Calculate residuals
    predicted_fit = fit_slope.value * x_data + fit_intercept.value
    residuals_fit = y_data - predicted_fit

    # Draw residuals
    if show_residuals.value:
        for i in range(len(x_data)):
            ax4.plot([x_data[i], x_data[i]], [y_data[i], predicted_fit[i]], 
                    'g-', linewidth=1.5, alpha=0.7)

    # Plot points on top
    ax4.scatter(x_data, y_data, c='steelblue', s=100, zorder=5, label='Data')

    sse_fit = np.sum(residuals_fit**2)
    ax4.set_xlabel('x')
    ax4.set_ylabel('y')
    ax4.set_title(f'Sum of Squared Residuals: {sse_fit:.2f}')
    ax4.set_xlim(0, 8)
    ax4.set_ylim(0, 10)
    ax4.legend()
    ax4.grid(True, alpha=0.3)
    plt.gca()
    return ax4, fig4, i, predicted_fit, residuals_fit, sse_fit, x_data, x_fit, y_data, y_fit


@app.cell
def _(mo):
    mo.md(
        r"""
        **Questions:**

        1. What slope and intercept minimize the sum of squared residuals?
        2. Why do we square the residuals instead of just adding them? (Hint: what if residuals are +2 and -2?)
        3. What is the approximate equation of the best-fit line?
        """
    )
    return


@app.cell
def _(mo):
    mo.md(
        r"""
        ---

        ## Part D: Slope on Curves — Tangent Line Intuition

        > **Key Idea:** On a straight line, the slope is the same everywhere. On a curve, the slope *changes* as you move along it. At any point on a curve, we can draw a line that "just touches" the curve — this is called the **tangent line**, and its slope tells us how steep the curve is at that exact point.

        Use the slider to move the point along the parabola and watch how the tangent line changes.
        """
    )
    return


@app.cell
def _(mo):
    x_point = mo.ui.slider(start=-3, stop=3, step=0.1, value=1, label="Point x-coordinate")
    x_point
    return (x_point,)


@app.cell
def _(np, plt, x_point):
    fig5, ax5 = plt.subplots(figsize=(9, 6))

    # Parabola y = x²
    x_curve = np.linspace(-3.5, 3.5, 200)
    y_curve = x_curve ** 2

    ax5.plot(x_curve, y_curve, 'b-', linewidth=2, label='y = x²')

    # Point on curve
    px = x_point.value
    py = px ** 2

    # Tangent line: derivative of x² is 2x
    slope_tangent = 2 * px
    tangent_x = np.linspace(px - 2, px + 2, 100)
    tangent_y = slope_tangent * (tangent_x - px) + py

    ax5.plot(tangent_x, tangent_y, 'r-', linewidth=2, label=f'Tangent (slope = {slope_tangent:.2f})')
    ax5.scatter([px], [py], c='red', s=120, zorder=5)

    ax5.axhline(y=0, color='k', linewidth=0.5)
    ax5.axvline(x=0, color='k', linewidth=0.5)
    ax5.set_xlim(-4, 4)
    ax5.set_ylim(-2, 12)
    ax5.set_xlabel('x')
    ax5.set_ylabel('y')

    if slope_tangent > 0.1:
        desc_para = "Positive slope — curve going UP ↗"
    elif slope_tangent < -0.1:
        desc_para = "Negative slope — curve going DOWN ↘"
    else:
        desc_para = "Zero slope — curve is FLAT here →"

    ax5.set_title(f'Parabola y = x² | At x = {px:.1f}: {desc_para}')
    ax5.legend()
    ax5.grid(True, alpha=0.3)
    plt.gca()
    return ax5, desc_para, fig5, px, py, slope_tangent, tangent_x, tangent_y, x_curve, y_curve


@app.cell
def _(mo):
    mo.md(
        r"""
        **Questions:**

        1. At what x-value is the slope of the tangent line equal to zero?
        2. For x > 0, is the slope positive or negative?
        3. For x < 0, is the slope positive or negative?
        4. Where is the slope steepest (largest magnitude)?
        """
    )
    return


@app.cell
def _(mo):
    mo.md(
        r"""
        ---

        ### Exponential Growth Curve

        Now let's look at an exponential: **y = 2ˣ**
        """
    )
    return


@app.cell
def _(mo):
    x_exp = mo.ui.slider(start=-2, stop=3, step=0.1, value=1, label="Point x-coordinate")
    x_exp
    return (x_exp,)


@app.cell
def _(np, plt, x_exp):
    fig6, ax6 = plt.subplots(figsize=(9, 6))

    # Exponential y = 2^x
    x_exp_curve = np.linspace(-2.5, 3.5, 200)
    y_exp_curve = 2 ** x_exp_curve

    ax6.plot(x_exp_curve, y_exp_curve, 'b-', linewidth=2, label='y = 2ˣ')

    # Point on curve
    px_exp = x_exp.value
    py_exp = 2 ** px_exp

    # Tangent line: derivative of 2^x is 2^x * ln(2)
    slope_exp = py_exp * np.log(2)
    tangent_exp_x = np.linspace(px_exp - 1.5, px_exp + 1.5, 100)
    tangent_exp_y = slope_exp * (tangent_exp_x - px_exp) + py_exp

    ax6.plot(tangent_exp_x, tangent_exp_y, 'r-', linewidth=2, label=f'Tangent (slope = {slope_exp:.2f})')
    ax6.scatter([px_exp], [py_exp], c='red', s=120, zorder=5)

    ax6.axhline(y=0, color='k', linewidth=0.5)
    ax6.axvline(x=0, color='k', linewidth=0.5)
    ax6.set_xlim(-3, 4)
    ax6.set_ylim(-1, 12)
    ax6.set_xlabel('x')
    ax6.set_ylabel('y')
    ax6.set_title(f'Exponential y = 2ˣ | At x = {px_exp:.1f}, slope = {slope_exp:.2f}')
    ax6.legend()
    ax6.grid(True, alpha=0.3)
    plt.gca()
    return (
        ax6,
        fig6,
        px_exp,
        py_exp,
        slope_exp,
        tangent_exp_x,
        tangent_exp_y,
        x_exp_curve,
        y_exp_curve,
    )


@app.cell
def _(mo):
    mo.md(
        r"""
        **Questions:**

        1. Is the slope ever negative on this curve?
        2. Is the slope ever zero on this curve?
        3. As x increases, does the slope get steeper or flatter?
        4. What's special about exponential growth compared to the parabola?
        """
    )
    return


@app.cell
def _(mo):
    mo.md(
        r"""
        ---

        ### Sine Wave

        Finally, let's explore **y = sin(x)** — a curve where the slope oscillates between positive, zero, and negative.
        """
    )
    return


@app.cell
def _(mo):
    x_sin = mo.ui.slider(start=0, stop=6.28, step=0.1, value=0, label="Point x-coordinate")
    x_sin
    return (x_sin,)


@app.cell
def _(np, plt, x_sin):
    fig7, ax7 = plt.subplots(figsize=(10, 5))

    # Sine curve
    x_sin_curve = np.linspace(-0.5, 7, 300)
    y_sin_curve = np.sin(x_sin_curve)

    ax7.plot(x_sin_curve, y_sin_curve, 'b-', linewidth=2, label='y = sin(x)')

    # Point on curve
    px_sin = x_sin.value
    py_sin = np.sin(px_sin)

    # Tangent line: derivative of sin(x) is cos(x)
    slope_sin = np.cos(px_sin)
    tangent_sin_x = np.linspace(px_sin - 1, px_sin + 1, 100)
    tangent_sin_y = slope_sin * (tangent_sin_x - px_sin) + py_sin

    ax7.plot(tangent_sin_x, tangent_sin_y, 'r-', linewidth=2, label=f'Tangent (slope = {slope_sin:.2f})')
    ax7.scatter([px_sin], [py_sin], c='red', s=120, zorder=5)

    # Mark key points
    ax7.axhline(y=0, color='k', linewidth=0.5)
    ax7.axvline(x=0, color='k', linewidth=0.5)

    # Add pi markers
    ax7.set_xticks([0, np.pi/2, np.pi, 3*np.pi/2, 2*np.pi])
    ax7.set_xticklabels(['0', 'π/2', 'π', '3π/2', '2π'])

    ax7.set_xlim(-0.5, 7)
    ax7.set_ylim(-2, 2)
    ax7.set_xlabel('x')
    ax7.set_ylabel('y')

    if slope_sin > 0.1:
        desc_sin = "going UP ↗"
    elif slope_sin < -0.1:
        desc_sin = "going DOWN ↘"
    else:
        desc_sin = "FLAT (peak or trough)"

    ax7.set_title(f'Sine Wave | At x = {px_sin:.2f}, slope = {slope_sin:.2f} — {desc_sin}')
    ax7.legend()
    ax7.grid(True, alpha=0.3)
    plt.gca()
    return (
        ax7,
        desc_sin,
        fig7,
        px_sin,
        py_sin,
        slope_sin,
        tangent_sin_x,
        tangent_sin_y,
        x_sin_curve,
        y_sin_curve,
    )


@app.cell
def _(mo):
    mo.md(
        r"""
        **Questions:**

        1. At x = 0, is the tangent line going up, down, or flat?
        2. At x = π/2 (the peak), what is the slope?
        3. At x = π, is the slope positive, negative, or zero?
        4. At x = 3π/2 (the trough), what is the slope?
        5. Where is the slope most positive? Most negative?
        """
    )
    return


@app.cell
def _(mo):
    mo.md(
        r"""
        ---

        ## Part E: Real-World Application — Model Training

        This simulates a machine learning model's accuracy over training epochs. Notice the diminishing returns!
        """
    )
    return


@app.cell
def _(mo):
    learning_rate = mo.ui.slider(start=0.1, stop=2.0, step=0.1, value=0.5, label="Learning Rate")
    learning_rate
    return (learning_rate,)


@app.cell
def _(learning_rate, np, plt):
    fig8, ax8 = plt.subplots(figsize=(9, 5))

    epochs = np.arange(0, 101)
    # Simulated accuracy curve: approaches 1 asymptotically
    k_rate = learning_rate.value
    accuracy = 1 - np.exp(-k_rate * epochs / 20)

    ax8.plot(epochs, accuracy, 'b-', linewidth=2)
    ax8.scatter(epochs[::10], accuracy[::10], c='steelblue', s=60, zorder=5)

    ax8.axhline(y=1.0, color='gray', linestyle='--', alpha=0.5, label='Maximum accuracy (1.0)')

    ax8.set_xlabel('Training Epochs')
    ax8.set_ylabel('Model Accuracy')
    ax8.set_title(f'Model Training Progress (Learning Rate = {learning_rate.value})')
    ax8.set_xlim(0, 100)
    ax8.set_ylim(0, 1.1)
    ax8.legend()
    ax8.grid(True, alpha=0.3)
    plt.gca()
    return accuracy, ax8, epochs, fig8, k_rate


@app.cell
def _(mo):
    mo.md(
        r"""
        **Questions:**

        1. Where on this curve is the slope steepest (fastest improvement)?
        2. Where does the slope approach zero (diminishing returns)?
        3. What happens with a higher learning rate? Lower learning rate?
        4. Will the accuracy ever actually reach 1.0?
        5. Between which epochs would a linear approximation be most reasonable?
        """
    )
    return


@app.cell
def _(mo):
    mo.md(
        r"""
        ---

        ## Part F: Correlation Explorer

        Explore how the correlation coefficient (r) relates to the visual pattern of data.
        """
    )
    return


@app.cell
def _(mo):
    correlation = mo.ui.slider(start=-1, stop=1, step=0.05, value=0.8, label="Target Correlation (r)")
    noise_level = mo.ui.slider(start=0, stop=2, step=0.1, value=0.5, label="Noise Level")
    mo.hstack([correlation, noise_level])
    return correlation, noise_level


@app.cell
def _(correlation, noise_level, np, plt):
    np.random.seed(42)

    n_points = 50
    x_corr = np.linspace(0, 10, n_points)

    # Generate y with target correlation
    r_target = correlation.value
    noise_val = noise_level.value

    if abs(r_target) > 0.01:
        y_base = r_target * x_corr
        y_noise = np.random.normal(0, noise_val * 2, n_points)
        y_corr = y_base + y_noise
    else:
        y_corr = np.random.normal(5, noise_val * 2, n_points)

    # Calculate actual correlation
    actual_r = np.corrcoef(x_corr, y_corr)[0, 1]

    fig9, ax9 = plt.subplots(figsize=(8, 6))
    ax9.scatter(x_corr, y_corr, c='steelblue', s=60, alpha=0.7)

    # Best fit line
    slope_corr, intercept_corr = np.polyfit(x_corr, y_corr, 1)
    fit_line_corr = slope_corr * x_corr + intercept_corr
    ax9.plot(x_corr, fit_line_corr, 'r-', linewidth=2, alpha=0.7, label=f'Best fit (slope={slope_corr:.2f})')

    ax9.set_xlabel('x')
    ax9.set_ylabel('y')
    ax9.set_title(f'Target r = {r_target:.2f} | Actual r = {actual_r:.2f}')
    ax9.legend()
    ax9.grid(True, alpha=0.3)
    plt.gca()
    return (
        actual_r,
        ax9,
        fig9,
        fit_line_corr,
        intercept_corr,
        n_points,
        noise_val,
        r_target,
        slope_corr,
        x_corr,
        y_base,
        y_corr,
        y_noise,
    )


@app.cell
def _(mo):
    mo.md(
        r"""
        **Questions:**

        1. What does r = 1 look like? r = -1? r = 0?
        2. With r = 0.8, is the relationship strong or weak?
        3. What does increasing noise do to the correlation?
        4. Can you have a strong relationship that isn't linear? (Correlation only measures *linear* relationship)
        """
    )
    return


@app.cell
def _(mo):
    mo.md(
        r"""
        ---

        ## Summary

        **Key Takeaways:**

        1. **Linear data** shows a consistent pattern; curved or scattered data doesn't fit a line well
        2. **Slope** tells us the rate of change — positive (increasing), negative (decreasing), or zero (flat)
        3. **Residuals** measure how far our predictions are from reality; we minimize squared residuals
        4. **On curves**, the slope changes from point to point — the tangent line shows the instantaneous slope
        5. **Correlation (r)** measures the strength of a linear relationship, from -1 to +1

        These ideas connect directly to machine learning: linear regression finds the best-fit line, gradient descent follows the slope to minimize error, and understanding curves helps us choose appropriate models.
        """
    )
    return


if __name__ == "__main__":
    app.run()
