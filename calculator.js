// Класс для управления калькулятором калорий (с поддержкой увеличения и уменьшения количества)
class Calculator {
    constructor() {
        this.items = []; // каждый элемент: { name, cal, protein, fat, carbs, count }
        this.total = { calories: 0, protein: 0, fat: 0, carbs: 0 };
        this.selectedListEl = document.getElementById('selected-list');
        this.totalCalEl = document.getElementById('total-cal');
        this.totalProteinEl = document.getElementById('total-protein');
        this.totalFatEl = document.getElementById('total-fat');
        this.totalCarbsEl = document.getElementById('total-carbs');
        this.clearBtn = document.getElementById('clear-btn');

        this.loadState();
        this.updateDisplay();
        this.bindEvents();
    }

    bindEvents() {
        // Добавление / увеличение через кнопки на карточках
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const name = btn.dataset.name;
                const cal = parseFloat(btn.dataset.cal);
                const protein = parseFloat(btn.dataset.protein);
                const fat = parseFloat(btn.dataset.fat);
                const carbs = parseFloat(btn.dataset.carbs);
                this.addItem({ name, cal, protein, fat, carbs });
            });
        });

        // Очистка всех блюд
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => {
                this.clearAll();
            });
        }
    }

    // Добавление или увеличение количества
    addItem(item) {
        const existing = this.items.find(i => i.name === item.name);
        if (existing) {
            existing.count += 1;
        } else {
            this.items.push({ ...item, count: 1 });
        }
        this.saveState();
        this.updateDisplay();
        this.markButton(item.name, true);
    }

    // Уменьшение количества на 1 (если count > 1), иначе удаление
    decreaseItem(name) {
        const existing = this.items.find(i => i.name === name);
        if (existing) {
            if (existing.count > 1) {
                existing.count -= 1;
                this.saveState();
                this.updateDisplay();
                // Кнопка остаётся в состоянии "Добавить ещё", т.к. count > 0
                this.markButton(name, true);
            } else {
                // Если count === 1, удаляем полностью
                this.removeItem(name);
            }
        }
    }

    // Полное удаление блюда по имени
    removeItem(name) {
        this.items = this.items.filter(item => item.name !== name);
        this.saveState();
        this.updateDisplay();
        this.markButton(name, false);
    }

    // Очистить всё
    clearAll() {
        const names = this.items.map(i => i.name);
        this.items = [];
        this.saveState();
        this.updateDisplay();
        names.forEach(name => this.markButton(name, false));
    }

    // Обновление интерфейса
    updateDisplay() {
        // Пересчёт суммы с учётом count
        this.total = { calories: 0, protein: 0, fat: 0, carbs: 0 };
        this.items.forEach(item => {
            this.total.calories += item.cal * item.count;
            this.total.protein += item.protein * item.count;
            this.total.fat += item.fat * item.count;
            this.total.carbs += item.carbs * item.count;
        });

        // Обновление списка выбранных блюд с кнопками "−" и "✕"
        if (this.selectedListEl) {
            this.selectedListEl.innerHTML = '';
            if (this.items.length === 0) {
                const li = document.createElement('li');
                li.style.cssText = 'color:#999; font-style:italic; text-align:center; list-style:none;';
                li.textContent = 'Пока ничего не выбрано';
                this.selectedListEl.appendChild(li);
            } else {
                this.items.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${item.name} ×${item.count}</span>
                        <span class="item-controls">
                            <button class="decrease-btn" data-name="${item.name}" title="Уменьшить на 1"><i class="fas fa-minus"></i></button>
                            <button class="remove-btn" data-name="${item.name}" title="Удалить полностью"><i class="fas fa-times"></i></button>
                        </span>
                    `;
                    this.selectedListEl.appendChild(li);

                    // Обработчик для кнопки уменьшения
                    const decreaseBtn = li.querySelector('.decrease-btn');
                    decreaseBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.decreaseItem(item.name);
                    });

                    // Обработчик для кнопки удаления
                    const removeBtn = li.querySelector('.remove-btn');
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.removeItem(item.name);
                    });
                });
            }
        }

        // Обновление итоговых цифр
        if (this.totalCalEl) this.totalCalEl.textContent = this.total.calories.toFixed(0);
        if (this.totalProteinEl) this.totalProteinEl.textContent = this.total.protein.toFixed(1);
        if (this.totalFatEl) this.totalFatEl.textContent = this.total.fat.toFixed(1);
        if (this.totalCarbsEl) this.totalCarbsEl.textContent = this.total.carbs.toFixed(1);
    }

    // Визуальное состояние кнопки на карточке
    markButton(name, added) {
        document.querySelectorAll('.add-btn').forEach(btn => {
            if (btn.dataset.name === name) {
                if (added) {
                    btn.classList.add('added');
                    btn.innerHTML = '<i class="fas fa-plus"></i> Добавить ещё';
                } else {
                    btn.classList.remove('added');
                    btn.innerHTML = '<i class="fas fa-plus"></i> Добавить';
                }
            }
        });
    }

    // Сохранение в localStorage
    saveState() {
        localStorage.setItem('calculatorItems', JSON.stringify(this.items));
    }

    // Загрузка из localStorage
    loadState() {
        const saved = localStorage.getItem('calculatorItems');
        if (saved) {
            try {
                this.items = JSON.parse(saved);
                // Восстанавливаем состояние кнопок
                this.items.forEach(item => {
                    this.markButton(item.name, true);
                });
            } catch (e) {
                this.items = [];
            }
        }
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('selected-list')) {
        window.calculator = new Calculator();
    }
});